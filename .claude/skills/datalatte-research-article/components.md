# MDX components for articles

All are registered in `src/app/blog/[slug]/page.tsx` (mdxComponents). Data is passed as strings: lists with `|`, matrix rows with `;`, cells with `,`. No `|` inside a label. Use double-quoted attributes; self-close with `/>`. Colours are the coffee palette only (no blue/green/purple).

## Readability

### BigStat (pull-quote number)
```mdx
<BigStat value="26%" label="One in four Poznań cafés is not represented online: no website and no social page can be found from its Google listing" note="55 of 210 cafés. Their median is 65 reviews." source="DataLatte analysis, Google Maps, 2-3 November 2026" />
```
- `value` short (`26%`, `18x`, `4x`, `20 months`). `label` is one sentence in plain words, rendered as a quote. `note` carries exact counts. `source` names dataset/date.
- 6-9 per long article, 1 per major section, none back to back.

### StatRow (existing, one per article, near the top)
```mdx
<StatRow values="210|35%|81%|28%" labels="Cafés|Own website|Phone|Full set" subs="Google Maps, Nov 2026|74 of 210|171 of 210|58 of 210" trends="neutral|neutral|neutral|neutral" />
```

### Callout (existing): `<Callout type="tip|warning|coffee|example|stat|faq" title="...">text</Callout>` (also `<Tip>`, `<Warning>`, `<Example>`).

## Charts (animate when scrolled into view)

| Component | Use for | Key props |
|---|---|---|
| `DonutChart` (existing) | Share split into 3-5 parts | `labels`, `values`, `unit="%"`, `centerLabel` |
| `BarChart` (existing) | Ranked horizontal bars, 4-10 items | `labels`, `values`, `unit`, `maxValue`, `highlights` ("Best" badge) |
| `ColumnChart` | Histograms, bands, shares by group | `labels`, `values`, `unit`, `highlights` (darker bars), `caption` |
| `AreaChart` | Curve over ordered categories (percentiles) | `labels`, `values`, `unit`, `xTitle`, `yTitle` |
| `StackedBar` | 100% split, one or several rows | `rows`, `segments`, `matrix="a,b,c;d,e,f"` (legend counts use row 1) |
| `Heatmap` | Table of groups x metrics with colour scale | `rows`, `cols`, `matrix`, `units="|||%|%"` |
| `BubbleChart` | Groups on two axes plus size | `labels`, `x`, `y`, `size`, `xTitle`, `yTitle`, `sizeTitle` |
| `RadarChart` | 6-9 prevalence shares (0-100) | `labels`, `values` |
| `ScoreBreakdown` | What a score is made of, per item | `rows`, `parts`, `matrix` (each row sums to the score) |
| `ProjectionChart` | Lines vs target lines over months | `months`, `start`, `rates`, `rateLabels`, `targets`, `targetLabels` |
| `LineChart` / `CompareBar` / `Funnel` / `StepPlan` (existing) | Time series, two-sided comparison, funnel, steps | see their files in `src/components/mdx/` |

Examples:
```mdx
<ColumnChart title="Number of reviews per café, 210 cafés" labels="None|1 to 49|50 to 199|200 to 499|500 to 999|1,000+" values="7|40|55|55|29|24" highlights="200 to 499" caption="The median café, 219 reviews, sits in the 200 to 499 band." />

<StackedBar title="Which social pages do cafés link?" rows="210 cafés" segments="Instagram and Facebook|Instagram only|Facebook only|Neither found" matrix="54,39,50,67" />

<Heatmap title="Postal areas compared" rows="61-8|61-7" cols="Cafés|Avg rating|Median reviews|Own website|Instagram" matrix="34,4.68,371,44,50;21,4.74,385,24,48" units="|||%|%" />

<ScoreBreakdown title="What the score is made of" rows="Cafe A|Cafe B" parts="Own website|Phone|Instagram|Facebook|E-mail|Rating|Reviews" matrix="20,10,15,5,10,15,25;20,10,15,0,10,15,25" />

<ProjectionChart title="Months to reach the median (assumption)" months="40" start="60" rates="8|15" rateLabels="8 reviews a month|15 reviews a month" targets="219|603" targetLabels="Median: 219 reviews|Top quarter: 603 reviews" />
```

## Rules for charts
- Every chart restates numbers that also appear in a table or sentence. Never chart a number that is not in the dataset.
- Add a `caption` with the denominator (n) and the date.
- Pick different types across the article; do not use the same type twice in a row.
- Projections must be labelled "(assumption)" in title or caption.
- Code: `src/components/mdx/Charts.tsx` (all new charts, `BigStat`), `ChartRoot.tsx` (adds `is-in` on scroll), animation CSS at the end of `src/app/globals.css` (`.mdx-chart.is-in ...`). Reduced-motion users get a soft fade.
- New chart type: add to Charts.tsx, wrap in `Frame` (it uses ChartRoot), register in the page's mdxComponents, document here.
