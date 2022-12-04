import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { NumericFormat } from 'react-number-format';


export default function Chart({ title, data, dataKey, grid }) {

  function CustomTooltip({ active, payload, label }) {
    if (active && payload) {
      return (
        <div className="tooltip">
          <p className="label">{label}</p>
          <p className="payload">
            <NumericFormat 
                value={payload[0].value} 
                decimalScale={2} 
                thousandSeparator="," 
                prefix={'$'} 
                decimalSeparator="." 
                displayType="text" /></p>
        </div>
      );
    }
    return null;
  }

  function formatNumber(number) {
    let dollarUSLocale = Intl.NumberFormat('en-US');
    return '$ '+ dollarUSLocale.format(number);
    
  }

  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data} margin={{top: 10, right: 10, left: 40, bottom: 0}}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <YAxis 
              tickCount={5} 
              tickFormatter={(number)=> formatNumber(number)}  />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip content={<CustomTooltip />} />
          {/* <Tooltip  /> */}
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
