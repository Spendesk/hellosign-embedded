import HelloSign from 'hellosign-embedded';

const form = document.getElementById('configuration-form');
const apiKeyElement = document.getElementById('api-key-input');
const clientIdElement = document.getElementById('client-id-input');
const redirectUrlElement = document.getElementById('redirect-url-input');
const submitButton = document.getElementById('submit-button');
const page_background_color = document.getElementById('page_background_color');
const header_background_color = document.getElementById('header_background_color');
const text_color1 = document.getElementById('text_color1');
const text_color2 = document.getElementById('text_color2');
const link_color = document.getElementById('link_color');
const primary_button_color = document.getElementById('primary_button_color');
const primary_button_text_color = document.getElementById('primary_button_text_color');
const primary_button_color_hover = document.getElementById('primary_button_color_hover');
const primary_button_text_color_hover = document.getElementById('primary_button_text_color_hover');
const secondary_button_color = document.getElementById('secondary_button_color');
const secondary_button_text_color = document.getElementById('secondary_button_text_color');
const secondary_button_color_hover = document.getElementById('secondary_button_color_hover');
const secondary_button_text_color_hover = document.getElementById('secondary_button_text_color_hover');

/**
 * Initializes the dmeo app.
 *
 * @see saveConfig
 * @see createRequest
 */
function init() {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // Disable the submit button temporarily.
    submitButton.setAttribute('disabled', true);

    // Save the config and create the signature request.
    saveConfig();
    createRequest();
  });
}

/**
 * Sends a request to the backend to create a new
 * signature request using the HelloSign NodeJS SDK with
 * the given API key and Client ID.
 *
 * @see openRequest
 */
function createRequest() {
  fetch('/create-signature-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientId: clientIdElement.value,
      apiKey: apiKeyElement.value
    })
  }).then((response) => {
    return response.json();
  }).then((body) => {
    if (body.success) {
      openRequest(body.data.signUrl);
    } else {
      alert(
        'Something went wrong. Did you enter your ' +
        'API Key and Client ID correctly?'
      );
    }

    // Re-enable submit button.
    submitButton.removeAttribute('disabled');
  });
}

/**
 * Initializes and opens the embedded signature request
 * with the signature URL provided by the backend.
 *
 * @param {string} signUrl
 */
function openRequest(signUrl) {
  HelloSign.init(clientIdElement.value);

  const options = {
    url: signUrl,
    allowCancel: true,
    debug: true,
    skipDomainVerification: true,
    uxVersion: 2,
    hideHeader: true,
    container: document.getElementById('hscontainer'),
    whiteLabelingOptions: {
      page_background_color: page_background_color.value || '#F7F8F9',
      header_background_color: header_background_color.value || '#1A1A1A',
      text_color1: text_color1.value || '#808080',
      text_color2: text_color2.value || '#FFFFFF',
      link_color: link_color.value || '#00B3E6',
      primary_button_color: primary_button_color.value || '#00B3E6',
      primary_button_text_color: primary_button_text_color.value || '#FFFFFF',
      primary_button_color_hover: primary_button_color_hover.value || '#00B3E6',
      primary_button_text_color_hover: primary_button_text_color_hover.value || '#FFFFFF',
      secondary_button_color: secondary_button_color.value || '#FFFFFF',
      secondary_button_text_color: secondary_button_text_color.value || '#00B3E6',
      secondary_button_color_hover: secondary_button_color_hover.value || '#FFFFFF',
      secondary_button_text_color_hover: secondary_button_text_color_hover.value || '#00B3E6',
    },
    messageListener(evt) {
      console.log(evt);
    }
  };

  // Set the redirect URL, if defined by the user.
  if (redirectUrlElement.value.length) {
    options.redirectUrl = redirectUrlElement.value;
  }

  console.log('OPTIONS', options);
  HelloSign.open(options);
}

/**
 * Saves the user's current config for ease of use.
 */
function saveConfig() {
  try {
    window.localStorage.setItem('config', (
      JSON.stringify({
        apiKey: apiKeyElement.value,
        clientId: clientIdElement.value,
        redirectUrl: redirectUrlElement.value,
        page_background_color: page_background_color.value,
        header_background_color: header_background_color.value,
        text_color1: text_color1.value,
        text_color2: text_color2.value,
        link_color: link_color.value,
        primary_button_color: primary_button_color.value,
        primary_button_text_color: primary_button_text_color.value,
        primary_button_color_hover: primary_button_color_hover.value,
        primary_button_text_color_hover: primary_button_text_color_hover.value,
        secondary_button_color: secondary_button_color.value,
        secondary_button_text_color: secondary_button_text_color.value,
        secondary_button_color_hover: secondary_button_color_hover.value,
        secondary_button_text_color_hover: secondary_button_text_color_hover.value,
      })
    ));
  } catch (err) {
    // User may have private browsing enabled.
    // Fail silently.
  }
}

/**
 * Prepopulates configuration fields from local storage.
 */
function loadConfig() {
  try {
    const config = window.localStorage.getItem('config');

    if (config) {
      const data = JSON.parse(config);

      apiKeyElement.value = data.apiKey;
      clientIdElement.value = data.clientId;
      redirectUrlElement.value = data.redirectUrl;

      page_background_color.value = data.page_background_color || '';
      header_background_color.value = data.header_background_color || '';
      text_color1.value = data.text_color1 || '';
      text_color2.value = data.text_color2 || '';
      link_color.value = data.link_color || '';
      primary_button_color.value = data.primary_button_color || '';
      primary_button_text_color.value = data.primary_button_text_color || '';
      primary_button_color_hover.value = data.primary_button_color_hover || '';
      primary_button_text_color_hover.value = data.primary_button_text_color_hover || '';
      secondary_button_color.value = data.secondary_button_color || '';
      secondary_button_text_color.value = data.secondary_button_text_color || '';
      secondary_button_color_hover.value = data.secondary_button_color_hover || '';
      secondary_button_text_color_hover.value = data.secondary_button_text_color_hover || '';
    }
  } catch (err) {
    // User may have private browsing enabled.
    // Fail silently.
  }
}

loadConfig();
init();
