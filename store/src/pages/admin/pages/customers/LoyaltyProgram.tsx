import React, { useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

interface RewardTier {
    id: string;
    name: string;
    pointsRequired: number;
    benefits: string[];
    color: string;
}

interface LoyaltyProgram {
    name: string;
    description: string;
    pointsPerDollar: number;
    signUpBonus: number;
    rewardTiers: RewardTier[];
}

const LoyaltyProgram: React.FC = () => {
    const [program, setProgram] = useState<LoyaltyProgram>({
        name: "Premium Rewards",
        description: "Our exclusive loyalty program for valued customers",
        pointsPerDollar: 10,
        signUpBonus: 500,
        rewardTiers: [
            {
                id: "1",
                name: "Bronze",
                pointsRequired: 0,
                benefits: ["5% discount on select items"],
                color: "bg-amber-600",
            },
            {
                id: "2",
                name: "Silver",
                pointsRequired: 2000,
                benefits: ["10% discount", "Free shipping"],
                color: "bg-gray-400",
            },
            {
                id: "3",
                name: "Gold",
                pointsRequired: 5000,
                benefits: ["15% discount", "Free shipping", "Early access to sales"],
                color: "bg-yellow-500",
            },
            {
                id: "4",
                name: "Platinum",
                pointsRequired: 10000,
                benefits: [
                    "20% discount",
                    "Free shipping",
                    "Early access to sales",
                    "Exclusive products",
                ],
                color: "bg-blue-400",
            },
        ],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [newTier, setNewTier] = useState<Omit<RewardTier, "id">>({
        name: "",
        pointsRequired: 0,
        benefits: [""],
        color: "bg-gray-500",
    });

    // const handleProgramChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setProgram((prev) => ({
    //         ...prev,
    //         [name]: name === "pointsPerDollar" || name === "signUpBonus" ? Number(value) : value,
    //     }));
    // };

    const handleTierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
        const { name, value } = e.target;
        if (typeof index === "number" && name === "benefits") {
            const updatedBenefits = [...newTier.benefits];
            updatedBenefits[index] = value;
            setNewTier((prev) => ({ ...prev, benefits: updatedBenefits }));
        } else {
            setNewTier((prev) => ({
                ...prev,
                [name]: name === "pointsRequired" ? Number(value) : value,
            }));
        }
    };

    const addBenefit = () => {
        setNewTier((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
    };

    const removeBenefit = (index: number) => {
        const updatedBenefits = newTier.benefits.filter((_, i) => i !== index);
        setNewTier((prev) => ({ ...prev, benefits: updatedBenefits }));
    };

    const addTier = () => {
        const tier: RewardTier = {
            ...newTier,
            id: Date.now().toString(),
        };
        setProgram((prev) => ({
            ...prev,
            rewardTiers: [...prev.rewardTiers, tier].sort((a, b) => a.pointsRequired - b.pointsRequired),
        }));
        setNewTier({
            name: "",
            pointsRequired: 0,
            benefits: [""],
            color: "bg-gray-500",
        });
        setIsTierModalOpen(false);
    };

    const removeTier = (id: string) => {
        setProgram((prev) => ({
            ...prev,
            rewardTiers: prev.rewardTiers.filter((tier) => tier.id !== id),
        }));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Loyalty Program</h1>
                    <p className="text-sm text-gray-500">
                        Design rewards and loyalty points for your customers here.
                    </p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-md ${isEditing
                        ? "bg-gray-200 hover:bg-gray-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {isEditing ? "Cancel Editing" : "Edit Program"}
                </button>
            </div>

            {/* Program Overview */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{program.name}</h2>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800">Points Rate</h3>
                        <p className="text-2xl font-bold">{program.pointsPerDollar} pts / $1</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800">Sign-up Bonus</h3>
                        <p className="text-2xl font-bold">{program.signUpBonus} pts</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-800">Reward Tiers</h3>
                        <p className="text-2xl font-bold">{program.rewardTiers.length} levels</p>
                    </div>
                </div>
            </div>

            {/* Reward Tiers */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Reward Tiers</h2>
                {isEditing && (
                    <button
                        onClick={() => setIsTierModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                        Add New Tier
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {program.rewardTiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`${tier.color} text-white rounded-lg overflow-hidden shadow-md`}
                    >
                        <div className="p-4 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{tier.name}</h3>
                                <p className="font-medium">{tier.pointsRequired.toLocaleString()} points required</p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => removeTier(tier.id)}
                                    className="text-white hover:text-red-200"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="bg-white bg-opacity-20 p-4">
                            <h4 className="font-semibold mb-2">Benefits:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {tier.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Tier Modal */}
            {isTierModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add Reward Tier</h2>
                                <button
                                    onClick={() => setIsTierModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tier Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newTier.name}
                                        onChange={(e) => handleTierChange(e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Points Required
                                    </label>
                                    <input
                                        type="number"
                                        name="pointsRequired"
                                        value={newTier.pointsRequired}
                                        onChange={(e) => handleTierChange(e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Color
                                    </label>
                                    <select
                                        name="color"
                                        value={newTier.color}
                                        onChange={(e:any) => handleTierChange(e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="bg-red-500">Red</option>
                                        <option value="bg-amber-600">Bronze</option>
                                        <option value="bg-gray-400">Silver</option>
                                        <option value="bg-yellow-500">Gold</option>
                                        <option value="bg-blue-400">Platinum</option>
                                        <option value="bg-purple-500">Purple</option>
                                        <option value="bg-green-500">Green</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Benefits
                                    </label>
                                    <div className="space-y-2">
                                        {newTier.benefits.map((benefit, index) => (
                                            <div key={index} className="flex">
                                                <input
                                                    type="text"
                                                    name="benefits"
                                                    value={benefit}
                                                    onChange={(e) => handleTierChange(e, index)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBenefit(index)}
                                                        className="ml-2 text-red-600"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addBenefit}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            + Add Another Benefit
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsTierModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addTier}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Add Tier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyProgram;