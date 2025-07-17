import { PartialBoxDetails } from "@/types";
import api from "./axiosClient";

export const fetchBoxDetails = async (
  boxId: string
): Promise<PartialBoxDetails> => {
  const { data } = await api.get<PartialBoxDetails>(`/box/${boxId}`);
  return data;
};
