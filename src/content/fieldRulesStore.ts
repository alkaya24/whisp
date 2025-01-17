// Importiert die Typdefinitionen für Feldbeschränkungen
import { FieldConstraints } from '../types/fieldTypes';

// Eine Map, die HTML-Eingabefelder mit ihren entsprechenden Feldbeschränkungen verknüpft
export const fieldRules = new Map<HTMLInputElement, FieldConstraints[]>();
