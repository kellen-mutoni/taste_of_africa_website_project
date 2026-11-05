// filter the recipe cards when a region button is clicked
const filterButtons = document.querySelectorAll('.filters button');
const recipeCards = document.querySelectorAll('.recipe-card');

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const region = button.dataset.filter;

        recipeCards.forEach(function (card) {
            if (region === 'all' || card.dataset.region === region) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// favorites: I save recipe IDs in localStorage so they stay after a refresh
const favButtons = document.querySelectorAll('.fav-btn');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

favButtons.forEach(function (button) {
    const id = button.dataset.id;

    // when the page loads, show a red heart on recipes I already saved
    if (favorites.includes(id)) {
        button.textContent = '❤️ Favorite';
    }

    button.addEventListener('click', function () {
        if (favorites.includes(id)) {
            // already a favorite, so remove it
            favorites = favorites.filter(function (item) {
                return item !== id;
            });
            button.textContent = '🤍 Favorite';
        } else {
            // not a favorite yet, so add it
            favorites.push(id);
            button.textContent = '❤️ Favorite';
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });
});

// contact form: Check the message length, then thank the person by name
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        if (message.length > 20) {
            contactForm.style.display = 'none';
            formMessage.textContent = "Thank you, " + name + "! We've received your message.";
        } else {
            formMessage.textContent = 'Your message needs to be more than 20 characters.';
        }
    });
}

// dark mode: Add a toggle button to the header and remember my choice
const siteHeader = document.querySelector('header');
const themeButton = document.createElement('button');
themeButton.id = 'theme-toggle';
siteHeader.appendChild(themeButton);

function updateButtonText() {
    if (document.body.classList.contains('dark')) {
        themeButton.textContent = '☀️ Light';
    } else {
        themeButton.textContent = '🌙 Dark';
    }
}

// when the page loads, restore the theme I saved last time
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}
updateButtonText();

themeButton.addEventListener('click', function () {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    updateButtonText();
});

// ingredient scaling: only runs on recipe pages that have an Ingredients heading
const allHeadings = document.querySelectorAll('main h2');
let ingredientsHeading = null;

allHeadings.forEach(function (heading) {
    if (heading.textContent === 'Ingredients') {
        ingredientsHeading = heading;
    }
});

let servingsSelect = null;
let ingredientItems = [];
const originalTexts = [];

if (ingredientsHeading) {
    ingredientItems = ingredientsHeading.parentElement.querySelectorAll('li');

    // keep the original text so I can always scale from it
    ingredientItems.forEach(function (item) {
        originalTexts.push(item.textContent);
    });

    // build the servings dropdown and put it under the heading
    const servingsLabel = document.createElement('label');
    servingsLabel.textContent = 'Servings: ';

    servingsSelect = document.createElement('select');
    [1, 2, 3].forEach(function (number) {
        const option = document.createElement('option');
        option.value = number;
        option.textContent = number + 'x';
        servingsSelect.appendChild(option);
    });

    servingsLabel.appendChild(servingsSelect);
    ingredientsHeading.after(servingsLabel);
}

function toNumber(text) {
  if (text.includes(' ')) {
    const parts = text.split(' ');
    const fraction = parts[1].split('/');
    return Number(parts[0]) + Number(fraction[0]) / Number(fraction[1]);
  }
  if (text.includes('/')) {
    const fraction = text.split('/');
    return Number(fraction[0]) / Number(fraction[1]);
  }
  return Number(text);
}

const numberPattern = /\d+\s\d+\/\d+|\d+\/\d+|\d+/g;

if (servingsSelect) {
  servingsSelect.addEventListener('change', function () {
    const multiplier = Number(servingsSelect.value);

    ingredientItems.forEach(function (item, index) {
      item.textContent = originalTexts[index].replace(numberPattern, function (match) {
        const scaled = toNumber(match) * multiplier;
        return Math.round(scaled * 100) / 100;
      });
    });
  });
}