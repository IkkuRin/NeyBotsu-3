const natural = require('natural');
const fs = require('fs');

function calculateSimilarity(input1, input2) {
    const similarities = natural.JaroWinklerDistance(input1, input2);
    return similarities * 100;
}

function categorizeInput(input, dataset) {
    let categoryScore = [];
    let maxSimilarity = 0;
    let choosenCategory = null;
    for (let category in dataset) {
        for (let pattern of dataset[category].patterns) {
            const similarity = calculateSimilarity(input, pattern);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                choosenCategory = category;
            }
            categoryScore.push([category, similarity]);
        }
    }

    categoryScore = categoryScore
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((accu, [key, value]) => {
            accu[key] = value;
            return accu;
        }, {});

    return { score: categoryScore, getCategory: choosenCategory };
}

function generateResponse(input, dataset) {
    const category = categorizeInput(input, dataset).getCategory;
    let responseScore = [];
    let choosenResponse = null;
    let maxSimilarity = 0;
    for (let responses of dataset[category].responses) {
        const similarity = calculateSimilarity(input, responses.query);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            choosenResponse = responses.response;
        }
        responseScore.push([responses.response, similarity]);
    }

    responseScore = responseScore
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((accu, [key, value]) => {
            accu[key] = value;
            return accu;
        }, {});

    return { generate: choosenResponse, score: responseScore };
}

function datasetUpdate(input, dataset) {
    input = input.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '');
    const category = categorizeInput(input, dataset).getCategory;
    if (!dataset[category]) {
        dataset[category] = {
            patterns: [],
            responses: []
        };
    }

    console.log('New Input Pattern Added: ', input);
    dataset[category].patterns.push(input);
}

function datasetSave(path, dataset) {
    try {
        return fs.writeFileSync(path, JSON.stringify(dataset, null, `\t`));
    } catch (err) {
        console.log('An error occurred while saving the dataset: ', err);
    }
}

function datasetLoad(path) {
    try {
        return fs.existsSync(path)
            ? JSON.parse(fs.readFileSync(path, 'utf8'))
            : {};
    } catch (err) {
        console.log('An error occurred while loading the dataset: ', err);
    }
}

function userdataSave(path, userdata) {
    console.log(userdata);
    try {
        return fs.writeFileSync(path, JSON.stringify(userdata, null, `\t`));
    } catch (err) {
        console.log('An error occurred while saving the userdata: ', err);
    }
}

function userdataLoad(path) {
    try {
        return fs.existsSync(path)
            ? JSON.parse(fs.readFileSync(path, 'utf8'))
            : {};
    } catch (err) {
        console.log('An error occurred while loading the userdata: ', err);
    }
}

module.exports = {
    calculateSimilarity: calculateSimilarity,
    categorizeInput: categorizeInput,
    response: generateResponse,
    save: datasetSave,
    load: datasetLoad,
    update: datasetUpdate,
    userSave: userdataSave,
    userLoad: userdataLoad
};
