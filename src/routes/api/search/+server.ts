import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, user_id, match_threshold = 0.3, match_count = 10 } = await request.json();

		if (!query || !user_id) {
			return json({ error: 'query and user_id are required' }, { status: 400 });
		}

		// 1. Appeler l'API d'embedding interne pour transformer le query en vecteur
		const embeddingResponse = await fetch(`${request.url.origin}/api/embed`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: query })
		});

		if (!embeddingResponse.ok) {
			console.error('Failed to generate query embedding');
			return json({ error: 'Failed to generate query embedding' }, { status: 500 });
		}

		const { embedding: queryEmbedding } = await embeddingResponse.json();

		// 2. Appeler la fonction RPC match_notes sur Supabase
		const { data, error } = await supabase.rpc('match_notes', {
			query_embedding: queryEmbedding,
			match_threshold,
			match_count
		});

		if (error) {
			console.error('Supabase search error:', error);
			return json({ error: 'Failed to search notes' }, { status: 500 });
		}

		// 3. Filtrer les résultats pour s'assurer qu'ils appartiennent à l'utilisateur
		// (Note: Cette vérification devrait aussi être intégrée dans la fonction RPC pour plus de sécurité)
		const userNotes = await supabase
			.from('notes')
			.select('id')
			.eq('user_id', user_id)
			.in('id', data.map((note: any) => note.id));

		if (userNotes.error) {
			console.error('User verification error:', userNotes.error);
			return json({ error: 'Failed to verify note ownership' }, { status: 500 });
		}

		const userNoteIds = new Set(userNotes.data.map(note => note.id));
		const filteredResults = data.filter((note: any) => userNoteIds.has(note.id));

		return json({ results: filteredResults });

	} catch (error) {
		console.error('Search notes error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};