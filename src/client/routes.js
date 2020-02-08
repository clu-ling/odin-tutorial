import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OdinUI from './components/odin-ui';
import MarkdownPage from './components/markdown-page';

// markdown
import tutorialMd from './markdown/tutorial.md';
import anotherAgentMd from './markdown/another-agent.md';
import chunkingTextMd from './markdown/chunking-text.md';
import simplePsgMd from './markdown/simple-psg.md';
import erSuffixMd from './markdown/er-suffix.md';
import noVerbsMd from './markdown/no-verbs.md';
import playgroundMd from './markdown/playground.md';

// grammars
import anotherAgentYml from './grammars/another-agent.yml';
import chunkingTextYml from './grammars/chunking-text.yml';
import simplePsgYml from './grammars/simple-psg.yml';
import erSuffixYml from './grammars/er-suffix.yml';
import noVerbsYml from './grammars/no-verbs.yml';
import cooperYml from './grammars/cooper.yml';
import surfacePatternChunkYml from './grammars/surface-pattern-chunk.yml';
import bioEventsYml from './grammars/bio-events.yml';
import playgroundYml from './grammars/playground.yml';

// txt
import anotherAgentTxt from './documents/another-agent.txt';
import chunkingTextTxt from './documents/chunking-text.txt';
import simplePsgTxt from './documents/simple-psg.txt';
import erSuffixTxt from './documents/er-suffix.txt';
import noVerbsTxt from './documents/no-verbs.txt';
import cooperTxt from './documents/cooper.txt';
import surfacePatternChunkTxt from './documents/surface-pattern-chunk.txt';
import bioEventsTxt from './documents/bio-events.txt';
import playgroundTxt from './documents/playground.txt';

const config = require('../../config');

const SideBarText = ({ name }) => (
  <h4 style={{ textAlign: 'center' }}>{`${name}`}</h4>
);

SideBarText.propTypes = {
  name: PropTypes.string.isRequired
};

// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
  {
    path: '/',
    exact: true,
    sidebar: () => <SideBarText name='Tutorial' />,
    main: () => (
      <MarkdownPage
        source={tutorialMd}
      />
    )
  },
  {
    path: '/challenges/another-agent',
    exact: true,
    sidebar: () => <SideBarText name="Challenge: Another Agent"/>,
    main: () => (
      <div>
        <MarkdownPage
          source={anotherAgentMd}
        />
        <OdinUI
          rules={anotherAgentYml}
          text={anotherAgentTxt}
          preFetch={false}
          showTopMainLabel
          showTopArgLabels={false}
          bottomTagCategory="POS"
          bottomLinkCategory="universal-enhanced"
          compactRows={false}
          rowVerticalPadding={80}
          linkSlotInterval={20}
        />
      </div>
    )
  },
  {
    path: '/challenges/chunking-text',
    exact: true,
    sidebar: () => <SideBarText name="Challenge: Chunking Text" />,
    main: () => (
      <div>
        <MarkdownPage
          source={chunkingTextMd}
        />
        <OdinUI
          rules={chunkingTextYml}
          text={chunkingTextTxt}
          preFetch={false}
          showTopMainLabel
          showTopArgLabels={false}
          bottomTagCategory="POS"
          bottomLinkCategory="universal-enhanced"
          compactRows={false}
          rowVerticalPadding={80}
          linkSlotInterval={20}
        />
      </div>
)},
  {
    path: '/challenges/simple-psg',
    exact: true,
    sidebar: () => <SideBarText name="Challenge: Simple PSG"/>,
    main: () =>
    <div>
    <MarkdownPage
      source={simplePsgMd}
    />
    <OdinUI
      rules={simplePsgYml}
      text={simplePsgTxt}
      preFetch={false}
      showTopMainLabel
      showTopArgLabels={false}
      bottomTagCategory="POS"
      bottomLinkCategory="universal-enhanced"
      compactRows={false}
      rowVerticalPadding={80}
      linkSlotInterval={20}
    />
    </div>
  },
  {
    path: '/challenges/er-suffix',
    exact: true,
    sidebar: () => <SideBarText name="Challenge: 'er'-suffix"/>,
    main: () =>
    <div>
    <MarkdownPage
      source={erSuffixMd}
    />
    <OdinUI
      rules={erSuffixYml}
      text={erSuffixTxt}
      preFetch={false}
      showTopMainLabel
      showTopArgLabels={false}
      bottomTagCategory="POS"
      bottomLinkCategory="universal-enhanced"
      compactRows={false}
      rowVerticalPadding={80}
      linkSlotInterval={20}
    />
    </div>
  },
  {
    path: '/challenges/no-verbs',
    exact: true,
    sidebar: () => <SideBarText name="Challenge: no verbs!"/>,
    main: () =>
    <div>
    <MarkdownPage
      source={noVerbsMd}
    />
    <OdinUI
      rules={noVerbsYml}
      text={noVerbsTxt}
      preFetch={false}
      showTopMainLabel
      showTopArgLabels={false}
      bottomTagCategory="POS"
      bottomLinkCategory="universal-enhanced"
      compactRows={false}
      rowVerticalPadding={80}
      linkSlotInterval={20}
    />
    </div>
  },
  {
    path: '/examples/cooper',
    exact: true,
    sidebar: () => <SideBarText name="Job title"/>,
    main: () =>
    <OdinUI
      rules={cooperYml}
      text={cooperTxt}
      preFetch
      showTopMainLabel
      showTopArgLabels={false}
      bottomTagCategory="POS"
      bottomLinkCategory="universal-enhanced"
      compactRows={false}
      rowVerticalPadding={80}
      linkSlotInterval={20}
    />
  },
  {
    path: '/examples/surface-pattern-chunk',
    exact: true,
    sidebar: () => <SideBarText name="Surface patterns (XP chunks)"/>,
    main: () =>
    <OdinUI
      rules={surfacePatternChunkYml}
      text={surfacePatternChunkTxt}
      preFetch
      showTopMainLabel
      showTopArgLabels={false}
      bottomTagCategory="POS"
      bottomLinkCategory="universal-enhanced"
      compactRows={false}
      rowVerticalPadding={80}
      linkSlotInterval={20}
    />
  },
  {
    path: '/examples/biology',
    exact: true,
    sidebar: () => <SideBarText name="Biology example" />,
    main: () => (
      <OdinUI
        rules={bioEventsYml}
        text={bioEventsTxt}
        preFetch
        showTopMainLabel={false}
        showTopArgLabels
        bottomTagCategory="POS"
        bottomLinkCategory="universal-enhanced"
        compactRows
        rowVerticalPadding={80}
        linkSlotInterval={20}
      />
    )
  },
  {
    path: '/playground',
    exact: true,
    sidebar: () => <SideBarText name="Playground" />,
    main: () => (
      <div>
        <MarkdownPage
          source={playgroundMd}
        />
        <OdinUI
          rules={playgroundYml}
          text={playgroundTxt}
          preFetch={false}
          showTopMainLabel={false}
          showTopArgLabels
          bottomTagCategory="POS"
          bottomLinkCategory="universal-enhanced"
          compactRows
          rowVerticalPadding={80}
          linkSlotInterval={20}
        />
      </div>
    )
  }
];

// class App extends Component {
export default function OdinRoutes() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flexDirection: 'column',
            textAlign: 'left',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '10px',
            width: '20%',
            background: '#f0f0f0'
          }}
        >
          {routes.map((route, index) => (
            // You can render a <Route> in as many places
            // as you want in your app. It will render along
            // with any other <Route>s that also match the URL.
            // So, a sidebar or breadcrumbs or anything else
            // that requires you to render multiple things
            // in multiple places at the same URL is nothing
            // more than multiple <Route>s.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
          <ul
            className="routerSidebar"
          >
            <li>
              <Link to="/">Tutorial</Link>
            </li>
            <li>
              Challenges
            </li>
            <ul
              className="routerSidebar"
              >
              <li>
                <Link to="/challenges/another-agent">Challenge 1 (easy)</Link>
              </li>
              <li>
                <Link to="/challenges/chunking-text">Challenge 2 (medium)</Link>
              </li>
              <li>
                <Link to="/challenges/simple-psg">Challenge 3 (medium++)</Link>
              </li>
              <li>
                <Link to="/challenges/er-suffix">Challenge 4 (easy)</Link>
              </li>
              <li>
                <Link to="/challenges/no-verbs">Challenge 5 (easy)</Link>
              </li>
            </ul>
            <li>
              Examples
            </li>
            <ul
              className="routerSidebar"
              >
              <li>
                <Link to="/examples/surface-pattern-chunk">Surface pattern (XP chunk)</Link>
              </li>
              <li>
                <Link to="/examples/biology">Biochemical events</Link>
              </li>
            </ul>
            <li>
              <Link to="/playground">Playground</Link>
            </li>
          </ul>

        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          {routes.map((route, index) => (
            // Render more <Route>s with the same paths as
            // above, but different components this time.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>

      </div>
    </Router>
  );
}
