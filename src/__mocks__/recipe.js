import faker from 'faker';

export function recipeListFactory(n = 50) {
  return [...new Array(n)].map(recipeFactory);
}

function foodImageFactory({ width = 320, height = 240 } = {}) {
  return `https://loremflickr.com/${width}/${height}/food?random=${faker.datatype.number()}`;
}
export function recipeFactory() {
  const images = [...new Array(faker.datatype.number({ min: 1, max: 4 }))].map(() => foodImageFactory());
  return {
    // _id: faker.datatype.uuid(),
    name: faker.lorem.words(),
    featuredImage: images[0],
    images,
    cookTimeMinutes: faker.datatype.number({ min: 10, max: 2 * 60 }),
    servings: faker.datatype.number({ min: 1, max: 6 }),
    authorId: faker.datatype.uuid(),
    notes: faker.lorem.sentences(),
    instructions: [...new Array(faker.datatype.number({ min: 3, max: 7 }))].map(faker.lorem.paragraph),
    ingredients: [...new Array(faker.datatype.number({ min: 3, max: 7 }))].map(recipeIngredientFactory),
  };
}

export function recipeIngredientFactory() {
  return {
    value: faker.datatype.number({ min: 10, max: 2 * 60 }),
    title: faker.lorem.words(),
    unit: unitFactory(),
  };
}

export function unitFactory() {
  const units = ['pc', 'kg', 'g', 'ml', 'l', 'teaspoon', 'tablespoon', 'cup', 'slice'];
  return faker.random.arrayElement(units);
}
