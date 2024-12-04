import mongoose, { Schema } from 'mongoose';

const testSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        no_of_questions: { type: Number },
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        duration: { type: Number, required: true },
        difficulty_level: {
            type: String,
            required: true,
            enum: ['beginner', 'intermediate', 'advanced'],
        },
        access_type: { type: String, required: true, enum: ['free', 'paid'] },
    },
    { timestamps: true }
);

testSchema.pre('save', function (next) {
    this.no_of_questions = this.questions.length;
    next();
});

const Test = mongoose.model('Test', testSchema);

export default Test;
