import InfoSection from '@/components/InfoSection';

const bridgeContent = {
  id: 'bridge-inspection-services',
  pretitle: 'Services',
  title: 'Bridge Inspection Services',
  copy: (
    <>
      <p>
        Melbourne Structural provides specialised bridge inspection and bridge condition assessment services
        across metropolitan and regional Victoria. Our inspections follow current Austroads and local authority
        guidance, delivering clear, concise reports with photographic evidence and recommended next steps.
      </p>

      <p className='mt-6'>
        Services include detailed visual inspections, non-destructive testing coordination, load rating
        assessments, and remedial design for maintenance or strengthening works. Reports can be tailored for
        asset owners, engineers, or contractors and include prioritised remedial actions and estimated costs.
      </p>

      <p className='mt-6'>
        Contact us to arrange a site inspection or to discuss how our bridge inspection services can be
        integrated into your asset management program.
      </p>
    </>
  ),
  bg: 'images/blueprint.svg',
  images: ['/images/bridge-01.svg', '/images/bridge-02.svg', '/images/bridge-03.svg'],
};

export default function Page() {
  return (
    <div>
      <InfoSection
        id={bridgeContent.id}
        pretitle={bridgeContent.pretitle}
        title={bridgeContent.title}
        copy={bridgeContent.copy}
        bg={bridgeContent.bg}
        images={bridgeContent.images}
        intervalMs={3500}
      />
    </div>
  );
}

