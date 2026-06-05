
import { model, models, Schema } from "mongoose";

const AlertSchema = new Schema({

    userId: { type: String, required: true },
    symbol: { type: String, required: true, uppercase: true },
    targetPrice: { type: Number, required: true },
    condition: {
        type: String,
        enum: ["above", "below"],
        required: true
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true }

);

const Alert = models?.Alert || model("Alert", AlertSchema);

export default Alert;
