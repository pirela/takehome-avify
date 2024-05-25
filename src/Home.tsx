import React from 'react';
import { useQuery } from '@tanstack/react-query'
import Bar from './components/Bar';
import { BarDatum } from '@nivo/bar';
import { formatDate } from './utils';

const fetchGetData = () => {
  return fetch('https://api.carbonintensity.org.uk/generation').then((res) =>
    res.json()
  )
}
const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['from', 'to'], queryFn: fetchGetData, select(data) {
      const keys: string[] = []
      const dataFormatted: BarDatum[] = data?.data?.generationmix?.map((item) => {
        keys.push(item.fuel)
        return {
          [`${item.fuel}`]: item.perc,
          id: item.fuel
        }
      })
      return {
        keys,
        dataFormatted,
        from: data.data.from,
        to: data.data.to
      }
    },
  })

  return (<div>
    <h1 className="ml-4 mt-4 text-3xl font-bold text-blue-500">UK Energy Mix</h1>
    {isLoading && <div>Cargando gráfica
      <div className="animate-pulse">
        <div className='h-6 bg-gray-200 rounded w-1/2'>
        </div>
        <div className='h-2/3 w-2/3  m-5 p-5 bg-gray-200  mt-2'>
        </div>
      </div>
    </div>}
    {!isLoading && <div className={"border shadow-md flex-grow-1 h-2/3 w-2/3 rounded m-5 p-5"} >
      <div className={""}>
        <div className='text-lg'>
          Periodo de data consulta desde <span className='font-semibold'>{formatDate(new Date(data.from))}</span> hasta <span className='font-semibold'> {formatDate(new Date(data.to))}</span>
        </div>
        <Bar data={data.dataFormatted} keys={data.keys} />
      </div>
    </div>}

  </div>)
};



export {
  Home
}
