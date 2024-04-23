import Pricing from '@components/Pricing';
import FeatureSections from '@components/FeatureSections';
import FrequentlyAskedQuestions from '@components/FrequentlyAskedQuestions';

export default function Page() {
  return (
    <section className="flex flex-col gap-10">
      <FeatureSections />
      <Pricing />
      <FrequentlyAskedQuestions />
    </section>
  );
}
