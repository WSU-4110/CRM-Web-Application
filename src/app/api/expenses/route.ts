import { NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    try {
        const userDocRef = doc(db, "expenses", userId);
        const docSnap = await getDoc(userDocRef);
    
        if (docSnap.exists()) {
            return NextResponse.json( {expenses: docSnap.data().expenses || []});
        } else {
            return NextResponse.json({ customers: [] }, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId, expense } = await request.json();

    if(!userId || !expense) {
        return NextResponse.json({ error: "User ID and expense data are required" }, { status: 400 });
    }

    try {
        const docRef = doc(db, "expenses", userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) { 
            await updateDoc(docRef, {
                expenses: arrayUnion(expense)
            });
        } else {
            await setDoc(docRef, {
                userId,
                expenses: [expense]
            });
        }

        return NextResponse.json({ message: "expense added successfully" });
    } catch (error) {
        console.error("Error adding expense:", error);
        return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
    }
}

export async function PUT(request) {
    const { userId, expense } = await request.json();

    if(!userId || !expense) {
        return NextResponse.json({ error: "User ID and expense data are required" }, { status: 400 });
    }

    try {
        const docRef = doc(db, "expenses", userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {  
            const expenses = docSnap.data().expenses;
            const expenseIndex = expenses.findIndex((exp) => exp.id === expense.id);
            expenses[expenseIndex] = {...expense};
    
            await updateDoc(docRef, {
                expenses,
            });
        } else {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "expense updated successfully" });
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
    }
}