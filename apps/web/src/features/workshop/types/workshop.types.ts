export type WorkshopStageKey =
  | "materials"
  | "frame_construction"
  | "upholstery"
  | "finishing"
  | "quality_control"
  | "delivery";

export type WorkshopJobStatus =
  | "not_started"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export type WorkshopPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type WorkshopStageStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped";

export type WorkshopEmployee = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
};

export type WorkshopStage = {
  id: string;
  key: WorkshopStageKey;
  name: string;
  sequence: number;
  status: WorkshopStageStatus;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
};

export type WorkshopNote = {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
};

export type WorkshopTimelineEvent = {
  id: string;
  type:
    | "created"
    | "stage_started"
    | "stage_completed"
    | "assigned"
    | "note_added"
    | "status_changed";
  title: string;
  description?: string;
  createdBy?: string;
  createdAt: string;
};

export type WorkshopJob = {
  id: string;
  jobNumber: string;

  orderId: string;
  orderNumber: string;

  productId: string;
  productName: string;
  productImage?: string;

  quantity: number;

  customerName: string;

  status: WorkshopJobStatus;
  priority: WorkshopPriority;

  currentStage: WorkshopStageKey;

  stages: WorkshopStage[];

  assignedTo?: WorkshopEmployee;

  startDate?: string;
  dueDate?: string;
  completedAt?: string;

  notes: WorkshopNote[];

  timeline: WorkshopTimelineEvent[];

  createdAt: string;
  updatedAt?: string;
};