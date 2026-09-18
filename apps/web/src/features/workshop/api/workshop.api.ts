import type {
  WorkshopEmployee,
  WorkshopJob,
  WorkshopJobStatus,
  WorkshopStageKey,
} from "../types/workshop.types";

const employees: WorkshopEmployee[] = [
  {
    id: "emp-001",
    name: "David Kariuki",
    role: "Workshop Lead",
  },
  {
    id: "emp-002",
    name: "Mercy Wambui",
    role: "Upholstery Specialist",
  },
  {
    id: "emp-003",
    name: "John Otieno",
    role: "Finishing Specialist",
  },
];

const createStages = (completedThrough: number, currentStage: number) => {
  const stageDefinitions = [
    ["materials", "Materials"],
    ["frame_construction", "Frame Construction"],
    ["upholstery", "Upholstery"],
    ["finishing", "Finishing"],
    ["quality_control", "Quality Control"],
    ["delivery", "Delivery"],
  ] as const;

  return stageDefinitions.map(([key, name], index) => {
    let status: "pending" | "in_progress" | "completed";

    if (index < completedThrough) {
      status = "completed";
    } else if (index === currentStage) {
      status = "in_progress";
    } else {
      status = "pending";
    }

    return {
      id: `stage-${index + 1}`,
      key,
      name,
      sequence: index + 1,
      status,
    };
  });
};

const mockJobs: WorkshopJob[] = [
  {
    id: "job-001",
    jobNumber: "JOB-10001",
    orderId: "order-001",
    orderNumber: "TF-10001",
    productId: "prod-001",
    productName: "Luna Sofa",
    productImage: "/products/luna-sofa.jpg",
    quantity: 1,
    customerName: "Wanjiku Kamau",
    status: "in_progress",
    priority: "high",
    currentStage: "upholstery",
    stages: createStages(2, 2),
    assignedTo: employees[1],
    startDate: "2026-09-15",
    dueDate: "2026-09-24",
    notes: [],
    timeline: [
      {
        id: "event-001",
        type: "created",
        title: "Workshop job created",
        createdAt: "2026-09-15T08:00:00Z",
      },
      {
        id: "event-002",
        type: "stage_completed",
        title: "Frame construction completed",
        createdAt: "2026-09-17T14:30:00Z",
      },
      {
        id: "event-003",
        type: "stage_started",
        title: "Upholstery started",
        createdAt: "2026-09-18T08:15:00Z",
      },
    ],
    createdAt: "2026-09-15T08:00:00Z",
  },

  {
    id: "job-002",
    jobNumber: "JOB-10002",
    orderId: "order-002",
    orderNumber: "TF-10002",
    productId: "prod-002",
    productName: "Mara Lounge Chair",
    productImage: "/products/mara-chair.jpg",
    quantity: 2,
    customerName: "Brian Mwangi",
    status: "in_progress",
    priority: "normal",
    currentStage: "frame_construction",
    stages: createStages(1, 1),
    assignedTo: employees[0],
    startDate: "2026-09-18",
    dueDate: "2026-09-27",
    notes: [],
    timeline: [
      {
        id: "event-004",
        type: "created",
        title: "Workshop job created",
        createdAt: "2026-09-18T07:30:00Z",
      },
      {
        id: "event-005",
        type: "stage_started",
        title: "Frame construction started",
        createdAt: "2026-09-18T08:00:00Z",
      },
    ],
    createdAt: "2026-09-18T07:30:00Z",
  },

  {
    id: "job-003",
    jobNumber: "JOB-10003",
    orderId: "order-003",
    orderNumber: "TF-10003",
    productId: "prod-003",
    productName: "Nairobi Dining Table",
    productImage: "/products/nairobi-table.jpg",
    quantity: 1,
    customerName: "Amina Hassan",
    status: "completed",
    priority: "normal",
    currentStage: "delivery",
    stages: createStages(6, 6),
    assignedTo: employees[0],
    startDate: "2026-09-05",
    dueDate: "2026-09-16",
    completedAt: "2026-09-16",
    notes: [],
    timeline: [
      {
        id: "event-006",
        type: "created",
        title: "Workshop job created",
        createdAt: "2026-09-05T08:00:00Z",
      },
      {
        id: "event-007",
        type: "status_changed",
        title: "Production completed",
        createdAt: "2026-09-16T16:00:00Z",
      },
    ],
    createdAt: "2026-09-05T08:00:00Z",
  },
];

export const getWorkshopJobs = async (): Promise<WorkshopJob[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockJobs;
};

export const getWorkshopJobById = async (
  id: string,
): Promise<WorkshopJob | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return mockJobs.find((job) => job.id === id) ?? null;
};

export const getWorkshopEmployees = async (): Promise<WorkshopEmployee[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return employees;
};

export const updateWorkshopJobStatus = async (
  jobId: string,
  status: WorkshopJobStatus,
): Promise<WorkshopJob | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const job = mockJobs.find((item) => item.id === jobId);

  if (!job) {
    return null;
  }

  job.status = status;
  job.updatedAt = new Date().toISOString();

  if (status === "completed") {
    job.completedAt = new Date().toISOString();
  }

  return job;
};

export const updateWorkshopStage = async (
  jobId: string,
  stageKey: WorkshopStageKey,
): Promise<WorkshopJob | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const job = mockJobs.find((item) => item.id === jobId);

  if (!job) {
    return null;
  }

  const stageIndex = job.stages.findIndex((stage) => stage.key === stageKey);

  if (stageIndex === -1) {
    return job;
  }

  job.stages = job.stages.map((stage, index) => {
    if (index < stageIndex) {
      return {
        ...stage,
        status: "completed",
      };
    }

    if (index === stageIndex) {
      return {
        ...stage,
        status: "in_progress",
        startedAt: stage.startedAt ?? new Date().toISOString(),
      };
    }

    return {
      ...stage,
      status: "pending",
    };
  });

  job.currentStage = stageKey;
  job.status = "in_progress";
  job.updatedAt = new Date().toISOString();

  return job;
};
