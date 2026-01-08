
import { callGeminiWithRotation } from '../../core';

// --- MODULE: TECHNICAL (SPECS & DETAILS) ---

export const Technical = {
    /**
     * Generate Spesifikasi Teknis (Structured Key: Value)
     */
    generateSpecs: async (productName: string) => {
        const prompt = `
        Task: Generate realistic technical specifications for POS Hardware: "${productName}".
        Output Format: Key: Value (One per line). Max 6 lines.
        Style: Technical, Precise, No Slang.
        Example:
        Processor: Intel Core i5
        RAM: 8GB DDR4
        Storage: 256GB SSD
        Printer: Thermal 80mm Auto-Cutter
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    /**
     * Generate Isi Paket (What's inside the box)
     */
    generateIncludes: async (productName: string) => {
        const prompt = `
        Task: List "Package Includes" (Isi Dalam Kotak) for "${productName}".
        Output Format: One item per line. Max 5 items.
        Example:
        1x Unit Mesin Kasir
        1x Adaptor Power
        1x Roll Kertas Thermal
        1x Kabel Data
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
