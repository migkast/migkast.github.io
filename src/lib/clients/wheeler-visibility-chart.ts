import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip);
type Series = {key:string;label:string;color:string;own?:boolean;counts:number[];total:number};
type ChartData = {dates:string[];series:Series[]};
const percent=(count:number,total:number)=>Math.round(count/total*1000)/10;

document.querySelectorAll<HTMLElement>('.visibility-chart').forEach(section=>{
 const {dates,series}=JSON.parse(section.querySelector('[data-visibility-data]')!.textContent!) as ChartData;
 const canvas=section.querySelector<HTMLCanvasElement>('[data-visibility-canvas]')!;
 const chart=new Chart(canvas,{
  type:'line',
  data:{labels:dates,datasets:series.map(item=>({
   label:item.label,data:item.counts.map(count=>percent(count,item.total)),
   borderColor:item.color,backgroundColor:item.color,borderWidth:item.own?2.5:1.8,
   pointRadius:3,pointHoverRadius:5,pointBackgroundColor:'#fff',pointBorderWidth:1.5,
   tension:0,fill:false,order:item.own?-1:0,
  }))},
  options:{
   responsive:true,maintainAspectRatio:false,animation:false,
   layout:{padding:{top:12,right:12,bottom:4,left:4}},
   interaction:{mode:'index',intersect:false},
   scales:{
    y:{min:0,max:100,border:{display:false},grid:{color:'#dfe5e3'},ticks:{stepSize:25,color:'#63706b',font:{size:12},padding:10,callback:value=>`${value}%`}},
    x:{border:{display:false},grid:{display:false},ticks:{color:'#63706b',font:{size:12},padding:12,maxRotation:0}},
   },
   plugins:{
    tooltip:{backgroundColor:'#fff',titleColor:'#172a21',bodyColor:'#46574e',borderColor:'#d5dfd9',borderWidth:1,padding:14,cornerRadius:8,bodySpacing:8,usePointStyle:true,
     titleFont:{size:13,weight:'bold'},bodyFont:{size:12},
     itemSort:(a,b)=>(b.parsed.y ?? 0)-(a.parsed.y ?? 0),
     callbacks:{labelColor:context=>({backgroundColor:series[context.datasetIndex].color,borderColor:series[context.datasetIndex].color,borderWidth:0}),label:context=>{
      const item=series[context.datasetIndex],count=item.counts[context.dataIndex];
      return `${item.label}: ${percent(count,item.total)}% (${count} / ${item.total})`;
     }},
    },
   },
  },
 });
 const buttons=Array.from(section.querySelectorAll<HTMLButtonElement>('[data-chart-toggle]'));
 function select(key?:string){
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(!key||button.dataset.chartToggle===key)));
  series.forEach((item,index)=>chart.setDatasetVisibility(index,!key||item.key===key));
  section.querySelector('[data-chart-all]')?.setAttribute('aria-pressed',String(!key));
  chart.update('none');
 }
 buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.chartToggle)));
 section.querySelector('[data-chart-all]')?.addEventListener('click',()=>select());
});
