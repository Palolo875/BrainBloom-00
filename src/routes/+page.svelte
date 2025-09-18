<script lang="ts">
        import { onMount } from 'svelte';
        import { Search, Plus, Edit3, Trash2, Brain } from 'lucide-svelte';
        
        let notes: any[] = [];
        let searchQuery = '';
        let searchResults: any[] = [];
        let newNoteContent = '';
        let editingNote: any = null;
        let editContent = '';
        let showSearch = false;
        let isLoading = false;
        let isCreating = false;
        let isSearching = false;
        let error = '';
        let user_id = '';

        // Generate or retrieve a unique user ID for this session
        function initializeUserId() {
                if (typeof localStorage !== 'undefined') {
                        let storedUserId = localStorage.getItem('brainbloom_user_id');
                        if (!storedUserId) {
                                // Generate a UUID v4
                                storedUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                        const r = Math.random() * 16 | 0;
                                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                                        return v.toString(16);
                                });
                                localStorage.setItem('brainbloom_user_id', storedUserId);
                        }
                        user_id = storedUserId;
                } else {
                        // Fallback for server-side rendering
                        user_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                const r = Math.random() * 16 | 0;
                                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                        });
                }
        }

        onMount(async () => {
                initializeUserId();
                await loadNotes();
        });

        async function loadNotes() {
                try {
                        isLoading = true;
                        error = '';
                        const response = await fetch(`/api/notes?user_id=${user_id}`);
                        const data = await response.json();
                        if (response.ok) {
                                notes = data.notes || [];
                        } else {
                                error = data.error || 'Erreur lors du chargement des notes';
                                console.error('Failed to load notes:', data);
                        }
                } catch (err) {
                        error = 'Erreur de connexion. Vérifiez votre réseau.';
                        console.error('Failed to load notes:', err);
                } finally {
                        isLoading = false;
                }
        }

        async function createNote() {
                if (!newNoteContent.trim()) return;
                
                try {
                        isCreating = true;
                        error = '';
                        const response = await fetch('/api/notes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ content: newNoteContent, user_id })
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                                newNoteContent = '';
                                await loadNotes();
                        } else {
                                error = data.error || 'Erreur lors de la création de la note';
                                console.error('Failed to create note:', data);
                        }
                } catch (err) {
                        error = 'Erreur de connexion. Vérifiez votre réseau.';
                        console.error('Failed to create note:', err);
                } finally {
                        isCreating = false;
                }
        }

        async function updateNote() {
                if (!editContent.trim()) return;
                
                try {
                        error = '';
                        const response = await fetch('/api/notes', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                        id: editingNote.id, 
                                        content: editContent, 
                                        user_id 
                                })
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                                editingNote = null;
                                editContent = '';
                                await loadNotes();
                        } else {
                                error = data.error || 'Erreur lors de la modification de la note';
                                console.error('Failed to update note:', data);
                        }
                } catch (err) {
                        error = 'Erreur de connexion. Vérifiez votre réseau.';
                        console.error('Failed to update note:', err);
                }
        }

        async function deleteNote(noteId: number) {
                try {
                        error = '';
                        const response = await fetch('/api/notes', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: noteId, user_id })
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                                await loadNotes();
                        } else {
                                error = data.error || 'Erreur lors de la suppression de la note';
                                console.error('Failed to delete note:', data);
                        }
                } catch (err) {
                        error = 'Erreur de connexion. Vérifiez votre réseau.';
                        console.error('Failed to delete note:', err);
                }
        }

        async function searchNotes() {
                if (!searchQuery.trim()) {
                        searchResults = [];
                        return;
                }
                
                try {
                        isSearching = true;
                        error = '';
                        const response = await fetch('/api/search', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                        query: searchQuery, 
                                        user_id,
                                        match_threshold: 0.3,
                                        match_count: 10
                                })
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                                searchResults = data.results || [];
                        } else {
                                error = data.error || 'Erreur lors de la recherche';
                                console.error('Failed to search notes:', data);
                        }
                } catch (err) {
                        error = 'Erreur de connexion. Vérifiez votre réseau.';
                        console.error('Failed to search notes:', err);
                } finally {
                        isSearching = false;
                }
        }

        function startEdit(note: any) {
                editingNote = note;
                editContent = note.content;
        }

        function cancelEdit() {
                editingNote = null;
                editContent = '';
        }

        function formatDate(dateString: string) {
                try {
                        if (!dateString) return 'Date inconnue';
                        return new Date(dateString).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                        });
                } catch (err) {
                        return 'Date invalide';
                }
        }
</script>

<div class="min-h-screen bg-primary-bg">
        <!-- Header -->
        <header class="bg-white/50 backdrop-blur-sm border-b border-accent-lavender/20 sticky top-0 z-10">
                <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                                <Brain class="text-accent-peach h-8 w-8" />
                                <h1 class="font-lora text-2xl font-semibold text-primary-text">BrainBloom</h1>
                        </div>
                        
                        <button 
                                on:click={() => showSearch = !showSearch}
                                class="flex items-center gap-2 px-4 py-2 bg-accent-lavender/20 hover:bg-accent-lavender/30 rounded-full transition-colors"
                        >
                                <Search class="h-5 w-5 text-primary-text" />
                                <span class="font-lexend text-sm text-primary-text">Rechercher</span>
                        </button>
                </div>
        </header>

        <main class="max-w-4xl mx-auto px-6 py-8">
                <!-- Error Message -->
                {#if error}
                        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p class="text-red-700 font-lexend text-sm">{error}</p>
                                <button 
                                        on:click={() => error = ''}
                                        class="mt-2 text-red-600 hover:text-red-800 font-lexend text-xs underline"
                                >
                                        Fermer
                                </button>
                        </div>
                {/if}

                <!-- Search Section -->
                {#if showSearch}
                        <div class="mb-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-accent-lavender/20">
                                <h2 class="font-lora text-xl font-medium text-primary-text mb-4">Recherche sémantique</h2>
                                <div class="flex gap-3 mb-4">
                                        <input
                                                bind:value={searchQuery}
                                                on:keydown={(e) => e.key === 'Enter' && searchNotes()}
                                                placeholder="Recherchez dans vos idées..."
                                                class="flex-1 px-4 py-3 bg-white/60 border border-accent-lavender/30 rounded-xl focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach transition-colors font-lexend"
                                        />
                                        <button
                                                on:click={searchNotes}
                                                disabled={isSearching}
                                                class="px-6 py-3 bg-accent-green/80 hover:bg-accent-green disabled:bg-accent-lavender/30 disabled:text-primary-text/50 text-white rounded-xl font-lexend font-medium transition-colors"
                                        >
                                                {isSearching ? 'Recherche...' : 'Chercher'}
                                        </button>
                                </div>

                                {#if searchResults.length > 0}
                                        <div class="space-y-3">
                                                <h3 class="font-lexend text-sm font-medium text-primary-text/70">Résultats trouvés :</h3>
                                                {#each searchResults as result}
                                                        <div class="p-4 bg-white/60 rounded-xl border border-accent-lavender/20">
                                                                <p class="font-lexend text-primary-text mb-2">{result.content}</p>
                                                                <span class="text-xs text-primary-text/60 font-lexend">Pertinence: {Math.round(result.similarity * 100)}%</span>
                                                        </div>
                                                {/each}
                                        </div>
                                {/if}
                        </div>
                {/if}

                <!-- Create Note Section -->
                <div class="mb-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-accent-lavender/20">
                        <h2 class="font-lora text-xl font-medium text-primary-text mb-4 flex items-center gap-2">
                                <Plus class="h-5 w-5 text-accent-peach" />
                                Nouvelle idée
                        </h2>
                        <div class="flex flex-col gap-3">
                                <textarea
                                        bind:value={newNoteContent}
                                        placeholder="Capturez vos pensées ici..."
                                        rows="4"
                                        class="w-full px-4 py-3 bg-white/60 border border-accent-lavender/30 rounded-xl focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach resize-none font-lexend transition-colors"
                                ></textarea>
                                <button
                                        on:click={createNote}
                                        disabled={!newNoteContent.trim() || isCreating}
                                        class="self-end px-6 py-3 bg-accent-peach hover:bg-accent-peach/80 disabled:bg-accent-lavender/30 disabled:text-primary-text/50 text-white rounded-xl font-lexend font-medium transition-colors"
                                >
                                        {isCreating ? 'Création...' : 'Enregistrer'}
                                </button>
                        </div>
                </div>

                <!-- Notes List -->
                <div class="space-y-4">
                        <h2 class="font-lora text-xl font-medium text-primary-text mb-6">Votre jardin d'idées</h2>
                        
                        {#if isLoading}
                                <div class="text-center py-8">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-peach mx-auto"></div>
                                        <p class="font-lexend text-primary-text/60 mt-2">Chargement...</p>
                                </div>
                        {:else if notes.length === 0}
                                <div class="text-center py-12 p-6 bg-white/20 rounded-2xl border border-accent-lavender/20">
                                        <Brain class="h-12 w-12 text-accent-lavender/60 mx-auto mb-3" />
                                        <p class="font-lexend text-primary-text/60">Votre jardin d'idées est vide. Plantez votre première graine !</p>
                                </div>
                        {:else}
                                {#each notes as note (note.id)}
                                        <div class="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-accent-lavender/20 hover:bg-white/50 transition-colors">
                                                {#if editingNote?.id === note.id}
                                                        <!-- Edit Mode -->
                                                        <div class="space-y-3">
                                                                <textarea
                                                                        bind:value={editContent}
                                                                        rows="4"
                                                                        class="w-full px-4 py-3 bg-white/80 border border-accent-lavender/30 rounded-xl focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach resize-none font-lexend"
                                                                ></textarea>
                                                                <div class="flex gap-2 justify-end">
                                                                        <button
                                                                                on:click={cancelEdit}
                                                                                class="px-4 py-2 bg-accent-lavender/30 hover:bg-accent-lavender/40 text-primary-text rounded-lg font-lexend text-sm transition-colors"
                                                                        >
                                                                                Annuler
                                                                        </button>
                                                                        <button
                                                                                on:click={updateNote}
                                                                                class="px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-lexend text-sm transition-colors"
                                                                        >
                                                                                Sauvegarder
                                                                        </button>
                                                                </div>
                                                        </div>
                                                {:else}
                                                        <!-- View Mode -->
                                                        <div class="flex justify-between items-start">
                                                                <div class="flex-1">
                                                                        <p class="font-lexend text-primary-text leading-relaxed mb-3">{note.content}</p>
                                                                        <div class="flex items-center gap-4 text-xs text-primary-text/60 font-lexend">
                                                                                <span>Créé: {formatDate(note.created_at)}</span>
                                                                                {#if note.updated_at !== note.created_at}
                                                                                        <span>Modifié: {formatDate(note.updated_at)}</span>
                                                                                {/if}
                                                                        </div>
                                                                </div>
                                                                <div class="flex gap-2 ml-4">
                                                                        <button
                                                                                on:click={() => startEdit(note)}
                                                                                class="p-2 text-primary-text/60 hover:text-accent-peach hover:bg-accent-peach/10 rounded-lg transition-colors"
                                                                        >
                                                                                <Edit3 class="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                                on:click={() => deleteNote(note.id)}
                                                                                class="p-2 text-primary-text/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        >
                                                                                <Trash2 class="h-4 w-4" />
                                                                        </button>
                                                                </div>
                                                        </div>
                                                {/if}
                                        </div>
                                {/each}
                        {/if}
                </div>
        </main>
</div>
