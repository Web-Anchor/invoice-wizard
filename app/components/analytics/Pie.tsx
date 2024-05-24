'use client';

import { Pie as PieChart } from '@ant-design/plots';
import { PieSkeleton } from '@components/Skeleton';
import { classNames } from '@helpers/index';

type Props = {
  title?: string;
  data?: { type?: string; value?: number }[];
  style?: 'spectral';
  labelPosition?: 'outside' | 'spider';
  loading?: boolean;
  class?: string;
};

const spectral = {
  color: {
    palette: 'spectral',
    offset: (t: number) => t * 0.8 + 0.1,
  },
};

export default function Pie(props: Props): React.ReactElement | null {
  const config = {
    data: props.data,
    angleField: 'value',
    colorField: 'name',
    legend: false,
    innerRadius: 0.6,
    labels: [
      {
        text: (props: any) => {
          const name = props?.name === 'undefined' ? 'Others' : props?.name;

          return name;
        },
        style: { fontSize: 14, fontWeight: 'bold' },
        position: props?.labelPosition,
      },
      {
        text: 'value',
        style: {
          fontSize: 14,
          dy: 14,
        },
      },
    ],
    style: {
      stroke: '#fff',
      inset: 1,
      radius: 10,
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: props.title,
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 16,
          fontStyle: 'bold',
        },
      },
    ],
    scale: props?.style === 'spectral' ? spectral : undefined,
  };

  if (props?.loading) {
    return (
      <section className={classNames('m-auto', props.class)}>
        <PieSkeleton />
      </section>
    );
  }
  if (!props?.data?.length) return null;

  return (
    <section className={props.class}>
      <PieChart {...config} />
    </section>
  );
}