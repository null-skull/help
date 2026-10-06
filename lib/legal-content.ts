// Legal pages. Copy is verbatim from https://www.helpperr.com/privacy-policy —
// edit here to update the page. Inline links use markdown syntax:
// [label](https://…) or [label](mailto:…).

export type LegalBlock =
  | { type: "p"; text: string }
  // Bulleted list; each item has a bold lead-in term followed by its text.
  | { type: "list"; items: { term: string; text: string }[] };

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

export type LegalDoc = {
  badge: string;
  title: string;
  updated: string;
  sections: LegalSection[];
};

export const PRIVACY_POLICY: LegalDoc = {
  badge: "LEGAL",
  title: "Privacy Policy",
  updated: "August 21, 2026",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      blocks: [
        {
          type: "p",
          text: "Welcome to Helpperr. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your data when you use our Chrome Extension and website platform.",
        },
      ],
    },
    {
      id: "single-purpose",
      title: "Single Purpose of the Chrome Extension",
      blocks: [
        {
          type: "p",
          text: "The single purpose of the Helpperr Chrome Extension is to allow users to capture, document, and share step-by-step guides and tutorials across websites visited by the user during an active, user-initiated recording. Once captured, the Helpperr web platform utilizes AI to analyze your screenshots and automatically generate documentation titles and descriptions, as well as generate video slideshows from those screenshots accompanied by AI-synthesized audio.",
        },
      ],
    },
    {
      id: "data-collection",
      title: "Data Collection and Usage",
      blocks: [
        {
          type: "p",
          text: "The Helpperr Chrome Extension collects data only when necessary to provide its workflow-recording functionality. Workflow capture begins only after the user explicitly starts a recording. The extension collects the following data as necessary to provide this functionality:",
        },
        {
          type: "list",
          items: [
            {
              term: "Interaction Data",
              text: "Information about actions performed during recording, including clicks, selected interface elements, limited interface text or labels, element selectors, interaction coordinates, timestamps, and related step information used to generate the guide.",
            },
            {
              term: "Visual Data (Screenshots)",
              text: "Screenshots of the active browser tab may be captured during an active recording to illustrate workflow steps. The extension automatically obscures standard text-entry fields, textareas, and editable content before screenshots are captured. Users should avoid recording pages containing highly sensitive information that cannot be automatically obscured. Helpperr does not continuously record the user's screen or access the device camera.",
            },
            {
              term: "Navigation Data",
              text: "Page URLs and navigation/tab changes occurring during an active recording when necessary to document multi-page workflows.",
            },
            {
              term: "Authentication Data",
              text: "Authentication tokens used to verify the user's Helpperr account and securely associate recorded guides with that account. The extension does not collect the user's Helpperr password.",
            },
            {
              term: "Temporary Local Data",
              text: "Recording information and screenshots may be temporarily stored in Chrome's local extension storage to maintain recording state and prevent data loss. Temporary extension data used during recording is removed after a successful upload. Failed or abandoned local workflow data is checked and removed when the extension starts if it is more than 24 hours old.",
            },
          ],
        },
        {
          type: "p",
          text: "Helpperr does not collect workflow interactions, screenshots, or navigation data while recording is inactive.",
        },
      ],
    },
    {
      id: "permissions",
      title: "Chrome Extension Permissions Justification",
      blocks: [
        {
          type: "p",
          text: "To function correctly, the Helpperr Chrome Extension requires certain permissions from your browser. We want to be completely transparent about why we need them:",
        },
        {
          type: "list",
          items: [
            {
              term: "Broad Host Permissions (HTTP/HTTPS)",
              text: 'The extension requests permission to operate on HTTP and HTTPS websites so you can record workflows on any web application or website of your choosing. Workflow recording and page-interaction capture occur only during a user-initiated recording session. We do not collect navigation data outside an active recording session or passively monitor your browsing activity. Workflow recording and page-interaction capture remain inactive until you explicitly click "Start Capture".',
            },
            {
              term: "Storage and Unlimited Storage",
              text: "We use local browser storage to temporarily save the screenshots and interaction events of your workflow as you record it, before securely uploading it to our servers. Because screenshots can be large, we require the unlimited storage permission to prevent data loss during long recordings.",
            },
            {
              term: "Scripting",
              text: "The extension uses Chrome's scripting capability to inject scripts needed for recording, redaction, authentication, and extension UI functionality when required. Recording and page-interaction tracking are activated only after the user explicitly starts a recording session.",
            },
          ],
        },
      ],
    },
    {
      id: "data-sharing",
      title: "Data Sharing and Processing",
      blocks: [
        {
          type: "p",
          text: "We do not sell, rent, or trade your personal data or captured guides. Your captured content is stored securely on Helpperr's servers and is accessible through your Helpperr account. You may choose to share your guides with other people through Helpperr's sharing features. Helpperr personnel do not routinely access captured content except as permitted under the Restricted Human Access section below.",
        },
        {
          type: "p",
          text: "Helpperr uses the following parties to process captured data strictly for the single purpose of providing the service, and never for advertising or unrelated profiling:",
        },
        {
          type: "list",
          items: [
            { term: "DigitalOcean", text: "Infrastructure and storage provider." },
            {
              term: "OpenAI",
              text: "AI processing provider (generates guide titles, descriptions, narration, and AI documentation).",
            },
            { term: "User-selected recipients", text: "When the user explicitly shares a guide." },
          ],
        },
      ],
    },
    {
      id: "limited-use",
      title: "Chrome Web Store Limited Use Policy",
      blocks: [
        {
          type: "p",
          text: "Helpperr's use of information collected through the Chrome Extension complies with the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/), including all applicable Limited Use requirements. Specifically:",
        },
        {
          type: "list",
          items: [
            { term: "No Sale of Data", text: "We do not sell your data to third parties." },
            {
              term: "No Unrelated Use",
              text: "We do not use or transfer your data for purposes that are unrelated to the extension's core functionality.",
            },
            {
              term: "No Credit/Lending Use",
              text: "We do not use or transfer your data to determine creditworthiness or for lending purposes.",
            },
            {
              term: "No Advertising Use",
              text: "We do not use or transfer data collected by the extension for personalized, retargeted, or interest-based advertising.",
            },
            {
              term: "Restricted Human Access",
              text: "Helpperr personnel do not routinely access the content of captured guides. Human access is permitted only when necessary for user-requested support with the user's explicit consent for the specific data needed, for security or abuse investigations, or to comply with applicable law, consistent with the Chrome Web Store User Data Policy.",
            },
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "Data Retention and Deletion",
      blocks: [
        {
          type: "p",
          text: "Captured guides are retained in the user's Helpperr account until the user deletes them or the account is deleted, subject to secure backups (retained for up to 30 days) and legally required retention. Temporary extension data used during recording is removed after successful upload. Failed or abandoned local workflow data is checked and removed when the extension starts if it is more than 24 hours old.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "Captured data is transmitted to Helpperr over HTTPS/TLS. Authentication credentials used by the extension are maintained in Chrome's session-only extension storage. Temporary workflow data stored locally during recording is removed after successful upload. Abandoned local recordings are checked and removed during extension startup when they are more than 24 hours old.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      blocks: [
        {
          type: "p",
          text: "If you have any questions about this privacy policy or our privacy practices, please contact us at [support.helpperr@gmail.com](mailto:support.helpperr@gmail.com).",
        },
      ],
    },
  ],
};
