/* Portfolio safeguard: this is a fictional business built as a concept site by
   Alectronic Solutions. Every page says so here, and the root metadata keeps
   the site out of search results so it is never mistaken for a real company.
   Inline styles on purpose, so it renders the same whatever the site's theme. */
export default function DemoNotice() {
  return (
    <div
      role="note"
      aria-label="Demo site notice"
      style={{
        background: "#0b1626",
        color: "#f5f1e6",
        fontSize: "13px",
        lineHeight: 1.5,
        padding: "10px 16px",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Fictional business. This is a concept website built by{" "}
      <a
        href="https://alectronicsolutions.com/portfolio"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        Alectronic Solutions
      </a>
      , not a real company.
    </div>
  );
}
