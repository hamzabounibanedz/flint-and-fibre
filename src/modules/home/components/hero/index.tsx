import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  return <section className="store-intro">
    <img src="/brand-mark.svg" alt="" width="56" height="56" />
    <h1>Flint &amp; Fibre</h1>
    <LocalizedClientLink href="/store">Browse the collection <span aria-hidden="true">→</span></LocalizedClientLink>
  </section>
}
