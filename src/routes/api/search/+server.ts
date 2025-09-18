import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

// Fonction pour calculer la similarité cosinus entre deux vecteurs
function cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) return 0;
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
                dotProduct += vecA[i] * vecB[i];
                normA += vecA[i] * vecA[i];
                normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) return 0;
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const POST: RequestHandler = async ({ request, fetch }) => {
        try {
                const { query, user_id, match_threshold = 0.3, match_count = 10 } = await request.json();

                if (!query || !user_id) {
                        return json({ error: 'query and user_id are required' }, { status: 400 });
                }

                // 1. Appeler l'API d'embedding interne pour transformer le query en vecteur
                const embeddingResponse = await fetch('/api/embed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: query })
                });

                if (!embeddingResponse.ok) {
                        console.error('Failed to generate query embedding');
                        return json({ error: 'Failed to generate query embedding' }, { status: 500 });
                }

                const { embedding: queryEmbedding } = await embeddingResponse.json();

                // 2. Rechercher les notes similaires en utilisant la similarité vectorielle
                // Pour cette implémentation simplifiée, nous allons chercher toutes les notes de l'utilisateur
                // et calculer la similarité côté client (dans un vrai projet, utilisez pgvector)
                const { data: userNotes, error } = await supabase
                        .from('notes')
                        .select('id, content, created_at, updated_at, embedding')
                        .eq('user_id', user_id);

                if (error) {
                        console.error('Supabase search error:', error);
                        return json({ error: 'Failed to search notes' }, { status: 500 });
                }

                // 3. Calculer la similarité cosinus pour chaque note
                const results = userNotes
                        .map((note: any) => {
                                if (!note.embedding || !Array.isArray(note.embedding)) {
                                        return null;
                                }
                                
                                const similarity = cosineSimilarity(queryEmbedding, note.embedding);
                                return {
                                        id: note.id,
                                        content: note.content,
                                        similarity: similarity,
                                        created_at: note.created_at,
                                        updated_at: note.updated_at
                                };
                        })
                        .filter((note: any) => note && note.similarity >= match_threshold)
                        .sort((a: any, b: any) => b.similarity - a.similarity)
                        .slice(0, match_count);

                return json({ results });

        } catch (error) {
                console.error('Search notes error:', error);
                return json({ error: 'Internal server error' }, { status: 500 });
        }
};