// Definiert die Typen für die Feldbeschränkungen
export type FieldConstraints = {
    type: 'number' | 'string' | 'validValues' | 'invalidValues' | 'checkbox'; // Der Typ des Feldes
    min?: number; // Minimale Zahl oder Zeichenlänge
    max?: number; // Maximale Zahl oder Zeichenlänge
    required?: boolean; // Gibt an, ob das Feld erforderlich ist (nur für Checkboxen)
    validValues?: string[]; // Liste der gültigen Werte
    invalidValues?: string[]; // Liste der ungültigen Werte
    validMessage?: string; // Nachricht, die bei gültiger Eingabe angezeigt wird
    invalidMessage?: string; // Nachricht, die bei ungültiger Eingabe angezeigt wird
    submitButtonId?: string; // ID des zugehörigen Submit-Buttons
};
