import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Globe, Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";

export function LinkItem({ link, index, onDelete }) {
  return (
    <Draggable draggableId={link.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4"
          style={provided.draggableProps.style}
        >
          <Card
            className={`p-4 flex items-center gap-4 transition-shadow duration-200 border-l-4 ${
              snapshot.isDragging
                ? "shadow-2xl ring-2 ring-brand-500 border-l-brand-500"
                : "hover:shadow-md border-l-transparent"
            }`}
          >
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={20} />
            </div>

            {/* Content Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-800 text-sm md:text-base">
                  {link.title}
                </span>
                <Edit2 size={12} className="text-slate-300" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Globe size={12} />
                <span className="truncate max-w-[200px]">{link.url}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => onDelete(link.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
