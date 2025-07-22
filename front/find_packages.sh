echo "=== Packages with React/Next dependencies ==="
for pkg in $(find /home/auper/web/gally/front -name "package.json" -not -path "*/node_modules/*"); do
  if grep -q -i "react\|next" "$pkg"; then
    pkg_name=$(grep '"name"' "$pkg" | head -1 | sed 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    pkg_version=$(grep '"version"' "$pkg" | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    echo
    echo "📦 ${pkg_name:-unnamed} v${pkg_version:-unknown}"
    echo "   📁 $pkg"
    echo "   🔍 React/Next references:"
    grep -i "react\|next" "$pkg" | sed 's/^/      /'
  fi
done
