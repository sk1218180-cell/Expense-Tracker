import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

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
        await newIncome.save();
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
export async function getAllIncome (req, res) {
    const userId = req.user._id;

    try {
        const income = await incomeModel.find({ userId}).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// Update income
export async function updateIncome (req, res) {
    const {id} = req.params;
    const userid = req.user._id;
    const { description, amount } = req.body;

    try {
        const updatedIncome = await incomeModel.findOneAndUpdate({
            _id: id,
            userId: userid},
        
        {description,amount}, 
        {new: true}

        );
        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            })
        }

        res.json({
            success: true,
            message: "Income updated successfully",
            data: updatedIncome
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }

}

// Delete income
export async function deleteIncome (req, res) {
   try {
    const income = await incomeModel.findByIdAndDelete({_id: req.params.id});
    if (!income) {
        return res.status(404).json({
            success: false,
            message: "Income not found"
        });
    }

    return res.json({
        success: true,
        message: "Income deleted successfully"
    })

   } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// To download income data as excel file
export async function downloadIncome (req, res) {
    const userId = req.user._id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = income.map((item) => ({
            Description: item.description,
            Amount: item.amount,
            Category: item.category,
            Date: new Date(item.date).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
        XLSX.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

// To get income overview based on time range
export async function getIncomeOverview (req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);

        const income = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
