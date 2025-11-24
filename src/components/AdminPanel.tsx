import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useParticipants } from '../hooks/useParticipants';
import { ParticipantInput } from '../lib/supabase';
import { formatScore } from '../lib/utils';

export function AdminPanel() {
  const { participants, loading, error, addParticipant, updateParticipant, deleteParticipant } = useParticipants();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ParticipantInput>({
    name: '',
    college: '',
    round1: 0,
    round2: 0,
    round3: 0,
    round4: 0,
    round5: 0,
  });

  const handleOpenForm = (participant?: typeof participants[0]) => {
    if (participant) {
      setFormData({
        name: participant.name,
        college: participant.college,
        round1: participant.round1,
        round2: participant.round2,
        round3: participant.round3,
        round4: participant.round4,
        round5: participant.round5,
      });
      setEditingId(participant.id);
    } else {
      setFormData({
        name: '',
        college: '',
        round1: 0,
        round2: 0,
        round3: 0,
        round4: 0,
        round5: 0,
      });
      setEditingId(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      college: '',
      round1: 0,
      round2: 0,
      round3: 0,
      round4: 0,
      round5: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const success = await updateParticipant(editingId, formData);
      if (success) handleCloseForm();
    } else {
      const success = await addParticipant(formData);
      if (success) handleCloseForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this participant?')) {
      await deleteParticipant(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['round1', 'round2', 'round3', 'round4', 'round5'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage scoreboard participants</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <button
          onClick={() => handleOpenForm()}
          className="mb-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Participant
        </button>

        {showForm && (
          <div className="mb-8 bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Participant' : 'Add New Participant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-600/50 border border-slate-500 rounded p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {(['round1', 'round2', 'round3', 'round4', 'round5'] as const).map(round => (
                    <div key={round}>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        {round === 'round1' ? 'R1' : round === 'round2' ? 'R2' : round === 'round3' ? 'R3' : round === 'round4' ? 'R4' : 'R5'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name={round}
                        value={formData[round]}
                        onChange={handleInputChange}
                        className="w-full px-2 py-2 bg-slate-600 border border-slate-500 rounded text-white text-center"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Add'} Participant
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading participants...</p>
          </div>
        ) : (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">College</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">R1</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">R2</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">R3</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">R4</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">R5</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Total</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                      No participants yet. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  participants.map((participant, index) => {
                    const total = participant.round1 + participant.round2 + participant.round3 + participant.round4 + participant.round5;
                    return (
                      <tr key={participant.id} className={index % 2 === 0 ? 'bg-slate-600/30' : ''}>
                        <td className="px-4 py-3 text-gray-200">{participant.rank}</td>
                        <td className="px-4 py-3 text-gray-200">{participant.name}</td>
                        <td className="px-4 py-3 text-gray-400">{participant.college}</td>
                        <td className="px-4 py-3 text-center text-gray-200">{formatScore(participant.round1)}</td>
                        <td className="px-4 py-3 text-center text-gray-200">{formatScore(participant.round2)}</td>
                        <td className="px-4 py-3 text-center text-gray-200">{formatScore(participant.round3)}</td>
                        <td className="px-4 py-3 text-center text-gray-200">{formatScore(participant.round4)}</td>
                        <td className="px-4 py-3 text-center text-gray-200">{formatScore(participant.round5)}</td>
                        <td className="px-4 py-3 text-center font-bold text-blue-300">{formatScore(total)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleOpenForm(participant)}
                              className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(participant.id)}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}