import React, { Fragment, ReactNode } from 'react';

const linkBase = 'https://github.com/jquense/react-big-calendar/blob/master/stories/demos/exampleCode/';

interface DemoLinkProps {
  fileName: string;
  children?: ReactNode; // This allows optional children to be passed
}

const DemoLink: React.FC<DemoLinkProps> = ({ fileName, children }) => (
  <Fragment>
    <div style={{ marginBottom: 10 }}>
      <a target="_blank" rel="noopener noreferrer" href={`${linkBase}${fileName}.js`}>
        &lt;\&gt; View Example Source Code
      </a>
    </div>
    {children ? <div style={{ marginBottom: 10 }}>{children}</div> : null}
  </Fragment>
);

export default DemoLink;
