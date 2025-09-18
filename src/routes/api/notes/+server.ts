import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
        try {
                const { content, user_id } = await request.json();

                if (!content || !user_id) {
                        return json({ error: 'Content and user_id are required' }, { status: 400 });
                }

                // 1. Appeler l'API d'embedding interne pour obtenir le vecteur
                const embeddingResponse = await fetch('/api/embed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: content })
                });

                if (!embeddingResponse.ok) {
                        console.error('Failed to generate embedding');
                        return json({ error: 'Failed to generate embedding' }, { status: 500 });
                }

                const { embedding } = await embeddingResponse.json();

                // 2. Insérer la note avec son embedding dans Supabase
                const { data, error } = await supabase
                        .from('notes')
                        .insert({
                                user_id,
                                content,
                                embedding
                        })
                        .select()
                        .single();

                if (error) {
                        console.error('Supabase insertion error:', error);
                        return json({ error: 'Failed to save note' }, { status: 500 });
                }

                return json({ note: data });

        } catch (error) {
                console.error('Create note error:', error);
                return json({ error: 'Internal server error' }, { status: 500 });
        }
};

export const GET: RequestHandler = async ({ url }) => {
        try {
                const user_id = url.searchParams.get('user_id');

                if (!user_id) {
                        return json({ error: 'user_id parameter is required' }, { status: 400 });
                }

                // Récupérer toutes les notes de l'utilisateur authentifié
                const { data, error } = await supabase
                        .from('notes')
                        .select('id, content, created_at, updated_at')
                        .eq('user_id', user_id)
                        .order('updated_at', { ascending: false });

                if (error) {
                        console.error('Supabase fetch error:', error);
                        return json({ error: 'Failed to fetch notes' }, { status: 500 });
                }

                return json({ notes: data });

        } catch (error) {
                console.error('Fetch notes error:', error);
                return json({ error: 'Internal server error' }, { status: 500 });
        }
};

export const PUT: RequestHandler = async ({ request, fetch }) => {
        try {
                const { id, content, user_id } = await request.json();

                if (!id || !content || !user_id) {
                        return json({ error: 'id, content, and user_id are required' }, { status: 400 });
                }

                // 1. Générer le nouvel embedding pour le contenu modifié
                const embeddingResponse = await fetch('/api/embed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: content })
                });

                if (!embeddingResponse.ok) {
                        return json({ error: 'Failed to generate embedding' }, { status: 500 });
                }

                const { embedding } = await embeddingResponse.json();

                // 2. Mettre à jour la note avec le nouveau contenu et embedding
                const { data, error } = await supabase
                        .from('notes')
                        .update({
                                content,
                                embedding,
                                updated_at: new Date().toISOString()
                        })
                        .eq('id', id)
                        .eq('user_id', user_id) // Sécurité : seul le propriétaire peut modifier
                        .select()
                        .single();

                if (error) {
                        console.error('Supabase update error:', error);
                        return json({ error: 'Failed to update note' }, { status: 500 });
                }

                return json({ note: data });

        } catch (error) {
                console.error('Update note error:', error);
                return json({ error: 'Internal server error' }, { status: 500 });
        }
};

export const DELETE: RequestHandler = async ({ request }) => {
        try {
                const { id, user_id } = await request.json();

                if (!id || !user_id) {
                        return json({ error: 'id and user_id are required' }, { status: 400 });
                }

                // Supprimer la note (seulement si elle appartient à l'utilisateur)
                const { error } = await supabase
                        .from('notes')
                        .delete()
                        .eq('id', id)
                        .eq('user_id', user_id); // Sécurité : seul le propriétaire peut supprimer

                if (error) {
                        console.error('Supabase deletion error:', error);
                        return json({ error: 'Failed to delete note' }, { status: 500 });
                }

                return json({ success: true });

        } catch (error) {
                console.error('Delete note error:', error);
                return json({ error: 'Internal server error' }, { status: 500 });
        }
};