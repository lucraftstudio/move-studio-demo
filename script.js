const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
});
const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  status.textContent = 'Demo preview only — your enquiry has not been sent or saved. A live website can connect this form to email or a booking service.';
  status.hidden = false;
});

const programmeData = {
  strength:{title:'Strong Foundations',style:'Controlled resistance training',description:'Learn the patterns that underpin strength training, then build them into a repeatable routine. Each session balances careful coaching with time to practise.',features:['A guided warm-up and movement preparation','Squat, hinge, push and pull practice','A focused cooldown and a simple progress check']},
  conditioning:{title:'Energy in Motion',style:'Functional intervals',description:'A varied whole-body session that combines movement quality with an energising pace. Work intervals and exercise options make the session adaptable.',features:['Movement preparation and interval briefing','A mix of functional stations and short recovery periods','A relaxed cooldown to finish']},
  mobility:{title:'Move Better',style:'Mobility and movement control',description:'Make room for better movement with controlled exercises and active recovery. Focus on range, balance and confidence rather than speed or heavy loads.',features:['Breathing and gentle movement preparation','Controlled mobility and stability work','A steady, unhurried finish']}
};
const days = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday'};
const timetable = {
  mon:[['07:00','strength'],['12:30','mobility'],['18:30','conditioning']],
  tue:[['07:00','conditioning'],['17:30','strength'],['19:00','mobility']],
  wed:[['07:00','strength'],['12:30','conditioning'],['18:30','mobility']],
  thu:[['07:00','mobility'],['17:30','conditioning'],['19:00','strength']],
  fri:[['07:00','conditioning'],['12:30','strength'],['18:30','mobility']],
  sat:[['09:00','strength'],['10:30','conditioning'],['12:00','mobility']]
};
function showContact(){
  document.querySelector('#form-status').hidden = true;
  document.querySelector('#contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  document.querySelector('[name="name"]').focus({preventScroll:true});
}
function renderDay(day){
  document.querySelectorAll('[data-day]').forEach(button => {
    const selected = button.dataset.day === day;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('#day-panel').setAttribute('aria-labelledby','day-' + day);
  const rows = timetable[day].map(([time,type]) => {
    const row = document.createElement('article'); row.className = 'session-row';
    const timeLabel = document.createElement('span'); timeLabel.className = 'session-time'; timeLabel.textContent = time;
    const info = document.createElement('div');
    const title = document.createElement('h3'); title.textContent = programmeData[type].title;
    const detail = document.createElement('small'); detail.textContent = '45 minutes · All levels'; info.append(title,detail);
    const tag = document.createElement('span'); tag.className = 'session-tag'; tag.textContent = type.toUpperCase();
    const button = document.createElement('button'); button.className = 'button outline'; button.textContent = 'Select session';
    button.setAttribute('aria-label',`Select ${programmeData[type].title} on ${days[day]} at ${time}`);
    button.addEventListener('click', () => {
      document.querySelector('#programme-select').value = type;
      document.querySelector('#selected-session').value = `${days[day]} ${time} — ${programmeData[type].title} (sample session)`;
      showContact();
    });
    row.append(timeLabel,info,tag,button); return row;
  });
  document.querySelector('#session-list').replaceChildren(...rows);
}
const dayButtons = [...document.querySelectorAll('[data-day]')];
dayButtons.forEach((button,index) => {
  button.addEventListener('click', () => renderDay(button.dataset.day));
  button.addEventListener('keydown', event => {
    let targetIndex;
    if(event.key === 'ArrowRight') targetIndex = (index + 1) % dayButtons.length;
    if(event.key === 'ArrowLeft') targetIndex = (index - 1 + dayButtons.length) % dayButtons.length;
    if(event.key === 'Home') targetIndex = 0;
    if(event.key === 'End') targetIndex = dayButtons.length - 1;
    if(targetIndex !== undefined){event.preventDefault();dayButtons[targetIndex].focus();renderDay(dayButtons[targetIndex].dataset.day);}
  });
});
renderDay('mon');
const programmeDialog = document.querySelector('#programme-dialog');
let selectedProgramme = 'strength';
document.querySelectorAll('[data-programme]').forEach(button => button.addEventListener('click', () => {
  selectedProgramme = button.dataset.programme;
  const programme = programmeData[selectedProgramme];
  document.querySelector('#programme-title').textContent = programme.title;
  document.querySelector('#programme-description').textContent = programme.description;
  document.querySelector('#programme-style').textContent = programme.style;
  document.querySelector('#programme-features').replaceChildren(...programme.features.map(text => {const li = document.createElement('li');li.textContent = text;return li;}));
  programmeDialog.showModal();
}));
document.querySelector('#try-programme').addEventListener('click', () => {
  document.querySelector('#programme-select').value = selectedProgramme;
  document.querySelector('#selected-session').value = '';
  programmeDialog.close(); showContact();
});
let currentBilling = 'monthly';
const prices = {monthly:{starter:160,regular:280,committed:360},quarterly:{starter:432,regular:756,committed:972}};
document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
  currentBilling = button.dataset.billing;
  document.querySelectorAll('[data-billing]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  document.querySelectorAll('[data-price]').forEach(item => item.textContent = 'RM ' + prices[currentBilling][item.dataset.price]);
  document.querySelectorAll('[data-period]').forEach(item => item.textContent = currentBilling === 'monthly' ? ' / month' : ' / 3 months');
}));
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  const plan = button.dataset.plan;
  document.querySelector('#selected-session').value = `${plan} plan — RM ${prices[currentBilling][plan.toLowerCase()]} ${currentBilling === 'monthly' ? 'per month' : 'for 3 months'} (example pricing)`;
  showContact();
}));
document.querySelector('#programme-select').addEventListener('change', () => {
  const input = document.querySelector('#selected-session');
  if(input.value.includes('(sample session)')) input.value = '';
});
