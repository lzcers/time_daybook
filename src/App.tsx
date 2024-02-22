import NixieClock from "./components/NixieClock";
import TaskList from "./components/TaskList";
import todaytimeIcon from "@/assets/icons/todaytime.svg";
import couttimeIcon from "@/assets/icons/counttime.svg";
import { useClocker } from "./context/clocker";

function App() {
    const { allElapsed, todayElapsed, show, setShow } = useClocker();
    return (
        <div className="main-container">
            <div className="time-area">
                <NixieClock unixTime={show === "all" ? allElapsed : todayElapsed} />
                <div className="show-times">
                    <div className="count-time-btn" onClick={() => setShow("all")}>
                        <img src={couttimeIcon} />
                        总时间
                    </div>
                    <div className="today-time-btn" onClick={() => setShow("today")}>
                        <img src={todaytimeIcon} />
                        今日时间
                    </div>
                </div>
            </div>
            <TaskList></TaskList>
        </div>
    );
}

export default App;
