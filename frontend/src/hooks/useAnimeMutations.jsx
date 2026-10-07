// useAnimeMutations.jsx
import { useSWRConfig } from "swr";
import { api } from "../Client";

export function useAnimeMutations() {
    const { mutate } = useSWRConfig();

    const updateUserAnime = async (animeId, data) => {
        let response;
        try {
            response = await api.post("/api/user-anime/update-useranime/", { anime: animeId, ...data });
        } catch (err) {
            console.error("Failed to update UserAnime", err);
            return { success: false, message: "UserAnime Change Failed" };
        }
        try {
            await mutate(["/api/user-anime/"]);
        } catch (err) {
            console.warn("UserAnime saved but list refresh failed", err);
        }
        return { success: true, message: "UserAnime Change Successful", anime_status: response.status };
    };

    const updateCustomAnime = async (anime) => {
        const { id, ...updatedFields } = anime;
        if (id == null) return { success: false, message: "CustomAnime update Failed: missing id" };
        let response;
        try {
            response = await api.patch(`/api/custom-anime/${id}/`, updatedFields);
        } catch (err) {
            console.error("Failed to update CustomAnime", err);
            return { success: false, message: "CustomAnime update Failed" };
        }
        try {
            await mutate(["/api/custom-anime/"]);
        } catch (err) {
            console.warn("CustomAnime saved but list refresh failed", err);
        }
        return { success: true, message: "CustomAnime update Successful", anime: response };
    };

    const addCustomAnime = async (animeValues) => {
        let response;
        try {
            response = await api.post("/api/custom-anime/", { ...animeValues });
        } catch (err) {
            console.error("Failed to add CustomAnime", err);
            return { success: false, message: "CustomAnime Add Failed" };
        }
        try {
            await mutate(["/api/custom-anime/"]);
        } catch (err) {
            console.warn("CustomAnime added but list refresh failed", err);
        }
        return { success: true, message: "CustomAnime Add Successful", anime: response };
    };

    return { updateUserAnime, updateCustomAnime, addCustomAnime };
}
