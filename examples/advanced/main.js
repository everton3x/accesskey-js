import accesskey from 'accesskey-js';

accesskey({
  debug: true,
  handler: function (event, element) {
    event.preventDefault();
    document.getElementById('message').innerHTML = 'The hotkey for element ' + element.id + ' is: ' + event.key;
  },
  extra: function (element) {
    let label = document.createElement('div');
    label.classList.add('ui', 'label');
    label.innerHTML = element.accessKey;
    element.appendChild(label);
  }
});