const JaroWinkler = require(process.cwd() + "/Structure/Function/jaroWinkler");

const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const fs = require('fs');

const modelSavePath = process.cwd() + "/Structure/Storage/ChatBot/models.json";
const dataFilePath = process.cwd() + "/Structure/Storage/ChatBot/datasetTrain.json";
let dataset = loadDataset(); // Load the dataset from the dataset.json file

let model;

module.exports = {
  name: "ChatBot",
  type: "messageCreate",
  async exec(message, cli) {
    if (cli.settings.chatbot.enabled == false) return;
    if (message.author.bot) return;
    if (message.channel.id !== cli.settings.chatbot.channelId) return;
      let selflearn = cli.settings.chatbot.selfLearn;

      message.channel.startTyping();

    const content = message.content.toLowerCase();
const categories = Object.keys(dataset);

    const categoryScores = categorizeInput(content, categories);
    const highestCategory = getMaxCategory(categoryScores);
    const response = generateResponse(highestCategory);

    if (selflearn && responde == undefined) {
        updateDataset(content, highestCategory);
        saveDataset(dataset);
        await trainModel();
    }

    console.log('Category Scores:', categoryScores);
    console.log('Chosen Category:', highestCategory);
    console.log('Bot Response:', response);

    message.channel.stopTyping();
    message.channel.send(response);
  },
};

async function loadModel() {
    try {
        model = await tf.loadLayersModel(`file://${modelSavePath}`);
        console.log('Model loaded successfully.');
    } catch (error) {
        console.log('No existing model found. Creating a new model.');
        createModel();
    }
}

function createModel() {
    model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({ units: 64, inputShape: [dataset.inputSize], activation: 'relu' }));

    // Hidden layer(s)
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));

    // Output layer
    model.add(tf.layers.dense({ units: dataset.numCategories, activation: 'softmax' }));

    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
}


async function trainModel() {
    const xs = tf.tensor2d(dataset.inputData);
    const ys = tf.tensor2d(dataset.outputData);

    await model.fit(xs, ys, {
        epochs: 20,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}/${10} - loss: ${logs.loss.toFixed(4)} - accuracy: ${logs.acc.toFixed(4)}`);
            },
        },
    });

    xs.dispose();
    ys.dispose();
    await model.save(`file://${modelSavePath}`);
    console.log('Model saved successfully.');
}


// Function to categorize user input based on semantic similarity
function categorizeInput(content, categories) {
    const categoryScores = {};

    categories.forEach((category) => {
        const patterns = dataset[category].patterns;
        const similarityScore = calculateSimilarity(content, patterns);
        categoryScores[category] = similarityScore;
    });

    return categoryScores;
}

// Function to get the category with the highest score
function getMaxCategory(categoryScores) {
    return Object.keys(categoryScores).reduce((a, b) => categoryScores[a] > categoryScores[b] ? a : b);
}

// Function to choose a response from the chosen category based on similarity
function generateResponse(category) {
    const responses = dataset[category].responses;
    const responseIndex = Math.floor(Math.random() * responses.length);
    return responses[responseIndex].message;
}

function calculateSimilarity(input, patterns) {
    const inputTokens = new Set(new natural.WordTokenizer().tokenize(input));
    const patternTokens = patterns.map((pattern) => new Set(new natural.WordTokenizer().tokenize(pattern)));

    const similarities = patternTokens.map((patternToken) => {
        const intersection = new Set([...inputTokens].filter((token) => patternToken.has(token)));
        const union = new Set([...inputTokens, ...patternToken]);
        const similarity = intersection.size / union.size;
        return similarity;
    });

    return Math.max(...similarities, 0); // Return the maximum similarity among patterns
}

function updateDataset(content, category) {
    if (!dataset[category]) {
        dataset[category] = { patterns: [], responses: [] };
    }

    const inputVector = textToVector(content, dataset.inputSize);
    dataset.inputData.push(inputVector);

    const outputVector = categoryToOneHotVector(category, dataset.numCategories);
    dataset.outputData.push(outputVector);

    dataset[category].patterns.push(content);
    dataset[category].responses.push({ question: content, message: 'Placeholder response' });
}

// Function to update the dataset with new words from user input
function textToVector(text, size) {
    const words = text.split(' ');
    const vector = new Array(size).fill(0);

    for (let i = 0; i < Math.min(words.length, size); i++) {
        vector[i] = words[i].charCodeAt(0) / 255;
    }

    return vector;
}

function categoryToOneHotVector(category, numCategories) {
    const oneHotVector = new Array(numCategories).fill(0);
    const categoryIndex = Object.keys(dataset).indexOf(category);
    oneHotVector[categoryIndex] = 1;
    return oneHotVector;
}

// Function to load the dataset from the dataset.json file
function loadDataset() {
    try {
        return fs.existsSync(dataFilePath) ? JSON.parse(fs.readFileSync(dataFilePath, 'utf8')) : {};
    } catch (e) {
        console.error("Error occured when loading dataset:", e)
    }
}
// Function to save the dataset to the dataset.json file
function saveDataset(dataset) {
    try {
            fs.writeFileSync(dataFilePath, JSON.stringify(dataset, null, "\t"));
    } catch (e) {
        console.error("Error occured when saving dataset:", e)
    }
}

// Function to check if two strings are similar
function isSimilar(inputA, inputB) {
    const similarity = JaroWinkler(inputA, inputB);
    return similarity > 0.6; // Adjust the similarity threshold as needed;
}