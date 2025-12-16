import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useLinks } from "../hooks/useLinks";
import { LinkItem } from "./LinkItem";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Plus } from "lucide-react";

export function LinkEditor() {
  const { links, loading, addLink, deleteLink, reorderLinks } = useLinks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderLinks(items);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle && newUrl) {
      addLink(newTitle, newUrl);
      setNewTitle("");
      setNewUrl("");
      setIsAdding(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-slate-400">Loading links...</div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Action */}
      {!isAdding ? (
        <Button
          className="w-full mb-6 py-6 text-lg shadow-lg shadow-brand-500/20"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="mr-2" /> Add New Link
        </Button>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 mb-6 animate-slide-up">
          <h3 className="font-bold text-slate-800 mb-4">Add New Link</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              placeholder="Title (e.g. My Portfolio)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="URL (https://...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Link</Button>
            </div>
          </form>
        </div>
      )}

      {/* Draggable List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {links.length === 0 && !isAdding && (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-400">
                    No links yet. Click "Add New Link" to start!
                  </p>
                </div>
              )}

              {links.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  onDelete={deleteLink}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
