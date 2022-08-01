vcl 4.0;
import std;

backend default {
    .host = "caddy";
    .port = "8080";
    .max_connections        = 300;
    .first_byte_timeout     = 300s;   # How long to wait before we receive a first byte from our backend?
    .connect_timeout        = 5s;     # How long to wait for a backend connection?
    .between_bytes_timeout  = 2s;     # How long to wait between bytes received from our backend?

  # Health check
#    .probe = {
#        .request =
#            "HEAD /health-check HTTP/1.1"
#            "Host: caddy-probe.local"
#            "Connection: close"
#            "User-Agent: Varnish Health Probe";
#        .timeout = 5s;
#        .interval = 5s;
#        .window = 4;
#        .threshold = 2;
#    }
}

# Hosts allowed to send BAN requests
acl invalidators {
  "localhost";
  "php";
  # local Kubernetes network
  # "10.0.0.0"/8;
  # "172.16.0.0"/12;
  # "192.168.0.0"/16;
}

sub vcl_recv {
  if (req.restarts > 0) {
    set req.hash_always_miss = true;
  }

  # Remove the "Forwarded" HTTP header if exists (security)
  unset req.http.forwarded;

  # To allow API Platform to ban by cache tags
  if (req.method == "BAN") {
    if (client.ip !~ invalidators) {
      return (synth(405, "Not allowed"));
    }

    if (req.http.ApiPlatform-Ban-Regex) {
      ban("obj.http.Cache-Tags ~ " + req.http.ApiPlatform-Ban-Regex);

      return (synth(200, "Ban added"));
    }

    return (synth(400, "ApiPlatform-Ban-Regex HTTP header must be set."));
  }

  if (req.method != "GET" && req.method != "HEAD") {
    return (pass);
  }

  #Do not cache "/" because it can be served by the Front (next.js) or API (ApiPlatform)
  if (req.url == "/") {
    return (pass);
  }

  # For health checks
  # if (req.method == "GET" && req.url == "/healthz") {
    # return (synth(200, "OK"));
  # }

  return (hash);
}

sub vcl_hit {
  if (obj.ttl >= 0s) {
    # A pure unadulterated hit, deliver it
    return (deliver);
  }

  if (std.healthy(req.backend_hint)) {
    # The backend is healthy
    # Fetch the object from the backend
    return (restart);
  }

  # No fresh object and the backend is not healthy
  if (obj.ttl + obj.grace > 0s) {
    # Deliver graced object
    # Automatically triggers a background fetch
    return (deliver);
  }

  # No valid object to deliver
  # No healthy backend to handle request
  # Return error
  return (synth(503, "API is down"));
}

sub vcl_deliver {
  # Don't send cache tags related headers to the client
  unset resp.http.url;
  # Comment the following line to send the "Cache-Tags" header to the client (e.g. to use CloudFlare cache tags)
  # unset resp.http.Cache-Tags;
}

sub vcl_backend_response {
  # Ban lurker friendly header
  set beresp.http.url = bereq.url;

  # Add a grace in case the backend is down
  set beresp.grace = 1h;
}
