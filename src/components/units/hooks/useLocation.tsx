export default () => {
  if (typeof window !== "undefined") {
    const { href, protocol, hostname, port } = window.location
    return { href, protocol, hostname, port }
  }
  return {href: null, protocol: null, hostname: null, port: null}
}

