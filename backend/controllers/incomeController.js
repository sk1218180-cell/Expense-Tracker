import incomeModel from "../models/incomeModel.js";


// Add new income
export async function addIncome (req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            })
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newincome.save();
        res.json({
            success: true,
            message: "Income added successfully",
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// Get all income for user
