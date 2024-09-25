import {useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import {AppDispatcher, RootState} from "./Store.ts";

export const useAppDispatch = () => useDispatch<AppDispatcher>();
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
