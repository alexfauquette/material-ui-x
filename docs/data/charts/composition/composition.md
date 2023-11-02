---
title: React Chart composition
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Chart composition

<p class="description">How to create advanced custom charts.</p>

## Overview

The `@mui/x-charts` follows an architecture based on context providers.
The overall idea is to pass your series and axes definitions to a single component, the `<ChartContainer />`.
This component will transform data and provide them to its children.

Based on the data provided by the container, you can render some graphical elements with provided subcomponents.
Such as `<LinePlot />`, `<ChartsYAxis />`.
Or you can create your [own subcomponents](/x/react-charts/components/).

## Container

### Responsive

There are two containers.
The `<ChartContainer />` and `<ResponsiveChartContainer />`.
As you can guess the only difference is the responsiveness.

The first one requires to provide `width` and `height` props.
Whereas the second one will compute the undefined dimension based on the size of its parent element.

:::warning
The parent element should have intrinsic dimensions.
If the parent dimension relies on its content, the responsive charts will not render.
:::

The next demo allows switching between a chart using `<ChartContainer />` with `width` (resp. `height`) props set to 500 (resp. 300),
and a chart using `<ResponsiveChartContainer />`.

{{"demo": "BasicComposition.js" }}

### Properties

The chart container gets all props that are not specific to a single graphical element.
It includes:

- The `xAxis` and `yAxis` props. More information in the [axis page](/x/react-charts/axis/).
- The `colors` prop as defined in the [color palette page](/x/react-charts/styling/#color-palette).
- The `series` and `dataset`.

#### Series

The `series` prop is an array of series definitions.
You can find an explanation about each specific series type in their respective docs page: [line](/x/react-charts/lines/), [bar](/x/react-charts/bars/), [pie](/x/react-charts/pie/).

When using a single components chart, the library can guess which kind of series you are defining.
For example, if you use `<BarChart />` the component assumes that `series` will be of type `'bar'`.

With composition, the chart container can't do such a guess.
So you have to add the property `type`.
It indicates the type of charts you are defining with this series.

```jsx
<BarChart series={[{
    data: [1, 2, 3] // No need to specify it is a bar series
}]} />

<ChartContainer
  series={[
    { data: [1, 2, 3], type: 'bar' }, // We need to specify this is for bar chart
    { data: [3, 2, 1], type: 'line' } // We need to specify this is for line chart
  ]}
>
  <BarPlot /> {/* Will only display series with type: 'bar'*/}
  <LinePlot /> {/* Will only display series with type: 'line'*/}
</ChartContainer>
```

Those series can use the `dataset` props [the same way](/x/react-charts/bars/#using-a-dataset) single component chart does.

In the next demo, the chart is made by composition with subcomponents `<BarPlot />` and `<LinePlot />`.
By modifying the series `type` property, you can switch between a line and bar rendering.

```jsx
<ResponsiveChartContainer
  series={[
    { type, data: [1, 2, 3, 2, 1] },
    { type, data: [4, 3, 1, 3, 4] },
  ]}
>
  <BarPlot />
  <LinePlot />
  <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
</ResponsiveChartContainer>
```

{{"demo": "SwitchSeriesType.js" }}

## Subcomponents

### Plotting

To display data, you have components named `<XxxPlot />` such as `<LinePlot />`, `<AreaPlot />`, `<MarkPlot />`, `<BarPlot />`, ...

### Axis

To add axes, you can use `<ChartsXAxis />` and `<ChartsYAxis />` as defined in the [axis page](/x/react-charts/axis/#composition).

It takes an `axisId` prop that indicates which axis defined in the container should be rendered.
If not provided it will pick the first one.

### Additional information

To add a legend to your chart, you can use `<ChartsLegend />`.

Most of the props are explained in the [legend page](/x/react-charts/legend/).
The demonstrations use the `slotProps.legend` object.
But with composition, you can directly pass props to `<ChartsLegend />`.

```jsx
// With single component chart
<BarChart
  slotProps={{
    legend: {
      direction: 'row',
    }
  }}
/>

// With composition
<ChartContainer>
  <ChartsLegend direction='row' />
</ChartContainer>
```

### Interaction

You can also add interaction elements such as `<ChartsAxisHighlight />` and `<ChartsTooltip />`.

:::info
By default the container is listening to mouse events to keep track of where the mouse is in the chart.

If you don't use the axis highlight or the tooltip, consider disabling this feature with `disableAxisListener` prop.

```jsx
<ChartContainer {...} disableAxisListener>
```

:::