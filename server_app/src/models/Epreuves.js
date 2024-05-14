import {Mongoose} from "mongoose";

const EpreuvesParentSchema = new Mongoose.Schema({
    epreuve_uuid: {
        type: String, required: true, unique: true
    }, epreuve_name: {
        type: String, required: true
    }, epreuve_description: {
        type: String, required: true
    }, epreuve_type: {
        type: String, required: true
    }, epreuve_variant: {
        type: String, required: true
    }, epreuve_status: {
        type: String, required: true
    }, epreuve_created_at: {
        type: Date, default: Date.now
    }, epreuve_updated_at: {
        type: Date, default: Date.now
    }
});

const TextEpreuveSchema = new Mongoose.Schema({
    ...EpreuvesParentSchema.obj,
    epreuve_content: {
        type: String, required: true
    }, epreuve_answer: {
        type: String, required: true
    }, epreuve_skill: {
        type: String, required: true
    }
});

const ChoiceEpreuveSchema = new Mongoose.Schema({
    ...EpreuvesParentSchema.obj,
    epreuve_choices: [{
        choice: {
            type: String, required: true
        }, corresponding_skill: {
            type: String, required: true
        }
    }],
    epreuve_background: {
        type: String, required: true
    }
});

const DilemmeEpreuveSchema = new Mongoose.Schema({
    ...EpreuvesParentSchema.obj,
    epreuve_choices: [{
        choice: {
            type: String, required: true
        },
        correct: {
            type: Boolean, required: true
        },
    }],
    epreuve_background: {
        type: String, required: true
    },
    epreuve_question: {
        type: String, required: true
    }
});

