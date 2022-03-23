import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function NavLink(props) {
  const { activeClassName, className: childClassName, children, ...rest } = props;
  const { asPath, isReady } = useRouter()
  const [className, setClassName] = useState(childClassName)
  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(props.as || props.href, location.href)
        .pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname

      const newClassName =
        linkPathname === activePathname
          ? `${childClassName} ${activeClassName}`.trim()
          : childClassName

      if (newClassName !== className) {
        setClassName(newClassName)
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    childClassName,
    activeClassName,
    setClassName,
    className,
  ])

  return (
    <Link {...rest} >
      <a className={className}>{children}</a>
    </Link>
  );
}
