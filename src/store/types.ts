import { ProvenanceGraph } from '@trrack/core/graph/graph-slice';
// eslint-disable-next-line import/no-cycle
import { SkipConditions, StudyConfig } from '../parser/types';

export interface ParticipantMetadata {
  userAgent: string;
  resolution: Record<string, string | number>;
  language: string;
  ip: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrrackedProvenance = ProvenanceGraph<any, any>;

// timestamp, event type, event data
type FocusEvent = [number, 'focus', string];
type InputEvent = [number, 'input', string];
type KeypressEvent = [number, 'keypress', string];
type MouseDownEvent = [number, 'mousedown', number[]];
type MouseUpEvent = [number, 'mouseup', number[]];
type MouseMoveEvent = [number, 'mousemove', number[]];
type ResizeEvent = [number, 'resize', number[]];
type ScrollEvent = [number, 'scroll', number[]];
type VisibilityEvent = [number, 'visibility', string];
export type EventType = MouseMoveEvent | MouseDownEvent | MouseUpEvent | KeypressEvent | ScrollEvent | FocusEvent | InputEvent | ResizeEvent | VisibilityEvent;

export type ValidationStatus = { valid: boolean, values: object }
export type TrialValidation = Record<
  string,
  {
    aboveStimulus: ValidationStatus;
    belowStimulus: ValidationStatus;
    sidebar: ValidationStatus;
    provenanceGraph?: TrrackedProvenance;
  }
>;

/**
The StoredAnswer object is a data structure describing the participants interaction with an individual component. It is the data structure used as values of the `answers` object of [ParticipantData](ParticipantData). The general structure for this is below:

```js
    {
      "answer": {
        "barChart": [
          1.3
        ]
      },
      "startTime": 1711641174858,
      "endTime": 1711641178836,
      "windowEvents": [
        ...
      ]
    }
```
The `answer` object here uses the "id" in the [Response](BaseResponse) list of the component in your [StudyConfiguration](StudyConfig) as its keys. It then contains a list of the answers given. You are also given a start and end time for the participants interaction with the component. Lastly, a set of windowEvents is given. Below is an example of the windowEvents list.

Each item in the window event is given a time, a position an event name, and some extra information for the event (for mouse events, this is the location).
*/
export interface StoredAnswer {
  /** Object whose keys are the "id"s in the Response list of the component in the StudyConfiguration and whose value is the inputted value from the participant. */
  answer: Record<string, { id: string, value: unknown }>;
  /** Time that the user began interacting with the component in epoch milliseconds. */
  startTime: number;
  /** Time that the user ended interaction with the component in epoch milliseconds. */
  endTime: number;
  /** The entire provenance graph exported from a Trrack instance from a React component. This will only be present if you are using React components and you're utilizing Trrack. */
  provenanceGraph?: TrrackedProvenance,
  /** A list containing the time (in epoch milliseconds), the action (focus, input, kepress, mousedown, mouseup, mousemove, resize, scroll or visibility), and then either a coordinate pertaining to where the event took place on the screen or string related to such event. Below is an example of the windowEvents list.
```js

"windowEvents" :[
  [
    1711641174878,
    "mousedown",
    [ 1843, 286 ]
  ],
  [
    1711641174878,
    "focus",
    "BUTTON"
  ],
  [
    1711641174935,
    "mouseup",
    [ 1843, 286 ]
  ],
  .
  .
  .
  [
    1711641178706,
    "mousemove",
    [ 1868, 728 ]
  ]
]
```
   */
  windowEvents: EventType[];
}

export interface StimulusParams<T> {
  parameters: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAnswer: ({ status, provenanceGraph, answers }: { status: boolean, provenanceGraph?: TrrackedProvenance, answers: Record<string, any> }) => void
}

export interface Sequence {
  id?: string;
  orderPath: string;
  components: (string | Sequence)[];
  skip?: SkipConditions;
}

export interface StoreState {
  studyId: string;
  answers: Record<string, StoredAnswer>;
  sequence: Sequence;
  config: StudyConfig;
  showStudyBrowser: boolean;
  showHelpText: boolean;
  alertModal: { show: boolean, message: string };
  trialValidation: TrialValidation;
  iframeAnswers: Record<string, unknown>;
  iframeProvenance: TrrackedProvenance | null;
  metadata: ParticipantMetadata;
}
