import InfoSection from '@/components/InfoSection';

const bridgeContent = {
  id: 'bridge-inspection-services',
  pretitle: 'Services',
  title: 'Bridge Inspection Services',
  subtitle: 'Keeping Australia\'s Bridges Safe, Compliant and Standing the Test of Time',
  copy: (
    <>
      <p className='text-lg font-semibold mb-6'>
        {"Keeping Australia's Bridges Safe, Compliant and Standing the Test of Time"}
      </p>

      <p>
        {"Bridges and road structures are among the most critical — and most easily overlooked — assets in any council or agency's network. A missed defect doesn't just cost money down the track; it puts public safety and legal compliance on the line. Melbourne Structural provides Level 1, Level 2 and Level 3 bridge inspections for councils, agencies and asset owners Australia wide, with deep local expertise in Victoria's Road Structures Inspection Manual (RSIM) framework under the Department of Transport and Planning. Wherever your network is located, our reporting is built to meet the relevant road authority's standards and slot straight into your asset management system."}
      </p>

      <h3 className='text-xl font-bold mt-8 mb-4'>Understanding Bridge Inspection Levels</h3>

      <p>
        {"Road authorities across Australia manage bridge condition through a tiered inspection system — Level 1, Level 2 and Level 3 — and while the finer detail varies slightly between jurisdictions, the purpose of each level is consistent nationally. In Victoria, this system is set out in the Department of Transport and Planning's Road Structures Inspection Manual (RSIM), which underpins our inspection methodology wherever we work. Here's what each level involves."}
      </p>

      <h4 className='text-lg font-semibold mt-6 mb-3'>Level 1 Inspection — Routine Safety Inspection</h4>
      <p>
        {'A Level 1 inspection is a frequent, visual "health check" of a structure, typically carried out every six to twelve months. It\'s designed to identify obvious safety hazards or sudden changes in condition — things like debris build-up, damage from vehicle strikes, vegetation encroachment, or blocked drainage — that need prompt attention. Level 1 inspections don\'t require specialist access equipment and can often be scheduled alongside routine maintenance visits, making them a cost-effective way to catch problems early.'}
      </p>
      <p className='italic text-sm mt-2'>
        Ideal for: ongoing safety monitoring between detailed inspections, and satisfying routine inspection
        obligations under your asset management plan.
      </p>

      <h4 className='text-lg font-semibold mt-6 mb-3'>Level 2 Inspection — Detailed Condition Inspection</h4>
      <p>
        {"A Level 2 inspection is a close, structured assessment of every structural component of the bridge — deck, girders, piers, abutments, bearings, joints, drainage and more — carried out by an accredited inspector. Each element is condition-rated to calculate the structure's overall Bridge Condition Rating (BCR), which feeds directly into your asset management system and long-term capital works planning. In Victoria, the RSIM requires these inspections at intervals of two to five years depending on the structure's risk profile; we apply the equivalent frequency and rating framework set by the relevant road authority for structures in other states and territories."}
      </p>
      <p className='italic text-sm mt-2'>
        Ideal for: statutory condition reporting, BCR calculation, and identifying maintenance or repair needs
        before they escalate into structural issues.
      </p>

      <h4 className='text-lg font-semibold mt-6 mb-3'>Level 3 Inspection — Detailed Structural Assessment</h4>
      <p>
        {"A Level 3 inspection is a targeted, engineer-led investigation triggered when a Level 1 or Level 2 inspection identifies a defect that may affect structural capacity or safety. It goes beyond visual assessment — often involving detailed measurement, material testing, load rating review and structural analysis by a qualified structural engineer — to determine the extent, cause and significance of a defect, and what needs to happen next."}
      </p>
      <p className='italic text-sm mt-2'>
        Ideal for: confirming whether a suspected structural deficiency is genuine, supporting load rating and
        posting decisions, and providing the engineering evidence needed for remediation planning or funding
        applications.
      </p>

      <h3 className='text-xl font-bold mt-8 mb-4'>What We Offer</h3>
      <ul className='list-disc list-inside space-y-2'>
        <li>
          {"Level 1, 2 and 3 bridge inspections for councils, road agencies and asset owners across Australia, with in-depth expertise in Victoria's RSIM framework under the Department of Transport and Planning"}
        </li>
        <li>
          Qualified, accredited inspectors with structural and geotechnical engineering backgrounds
        </li>
        <li>
          {"Clear, defensible reporting — condition ratings, figure-referenced defect observations and prioritised recommendations your asset managers can act on immediately"}
        </li>
        <li>
          Responsive scheduling, including urgent Level 3 assessments following vehicle strikes, flood events
          or reported defects, wherever your structures are located
        </li>
      </ul>

      <h3 className='text-xl font-bold mt-8 mb-4'>Why Choose Melbourne Structural</h3>
      <ul className='list-disc list-inside space-y-2'>
        <li>
          <strong>Engineering expertise, not just inspection checklists.</strong> {" Every inspection is backed by genuine structural and geotechnical engineering judgement — so when a defect is found, you get an informed opinion on what it means for the structure, not just a photo and a rating number."}
        </li>
        <li>
          <strong>Victorian expertise, national reach.</strong> {" Our home ground is Victoria, where our reporting speaks the same language as the Department of Transport and Planning, VicRoads-derived standards and local council asset managers — and we bring that same rigour to inspection work for clients across other states and territories."}
        </li>
        <li>
          <strong>Reports that hold up to scrutiny.</strong> {" Our condition reports are clear, figure-referenced and professionally presented — built to support funding submissions, maintenance prioritisation and, where needed, legal or insurance review."}
        </li>
        <li>
          <strong>A single point of contact across all three levels.</strong> {" Whether you need an annual Level 1 safety check or an urgent Level 3 structural assessment after an incident, you're working with the same team who already knows your network."}
        </li>
      </ul>
    </>
  ),
  bg: '/images/about-blueprint.svg',
  images: [
    '/images/bridge-01.webp',
    '/images/bridge-02.webp',
    '/images/bridge-03.webp',
    '/images/bridge-04.webp',
    '/images/bridge-05.webp',
  ],
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
        intervalMs={4000}
      />
    </div>
  );
}

