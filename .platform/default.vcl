vcl 4.0;
import std;

# Hosts allowed to send BAN requests
acl invalidators {
    "localhost";
    "127.0.0.1";
    # The 3 IPs below are the "fr-3" outbound IPs of Platform.sh
    # You should change this to the proper outbound IPs of your zone.
    "135.125.91.125";
    "135.125.89.47";
    "135.125.90.255";
}

sub vcl_recv {
    # Route requests either to api or to the React admin app.
    if (req.url ~ "^/api(/|$)") {
        set req.backend_hint = api.backend();
    } else {
        set req.backend_hint = admin.backend();
    }

    if (req.restarts > 0) {
        set req.hash_always_miss = true;
    }

    # Remove the "Forwarded" HTTP header if exists (security)
    unset req.http.forwarded;

    # To allow API Platform to ban by cache tags
    if (req.method == "BAN") {
        # The Platformsh router provides the real client IP as X-Client-IP
        # Use std.ip to convert the string to an IP for comparison

        if (std.ip(req.http.X-Client-IP, "0.0.0.0") !~ invalidators) {
        # Uncomment this line if you want to restrict the purge to specific ips.
        # Do not forget to add the corresponding ips in the acl above.
        #    return (synth(405, "Client Not allowed to ban."));
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

    # Do not cache "/" because it can be served by the Front (next.js) or API (ApiPlatform)
    # Temporary solution to avoid issue when Google crawls the website (see ESPP-378)
    if (req.url == "/") {
        return (pass);
    }

    # Manage websocket
    if (req.http.upgrade ~ "(?i)websocket") {
        return (pipe);
    }

    return (hash);
}

sub vcl_pipe {
    if (req.http.upgrade) {
        set bereq.http.upgrade = req.http.upgrade;
        set bereq.http.connection = req.http.connection;
    }
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
