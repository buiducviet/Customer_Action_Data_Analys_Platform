import classNames from "classnames/bind";
import styles from "./Analys.module.scss";
import customStyles from "../ProductPages/CustomTable";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Modal, Button } from "react-bootstrap";
import { getAddress, deleteAddress, createAddress } from "../../../services/admin/addressShop";
import { formatNumber } from "../../users/FormatNumber";
const cx = classNames.bind(styles);
import originalStoreData from "../../users/StoreLocations/storeData";
import { toast } from "react-toastify";
const Analys = () => {
  const [totalPrice, setTotalPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [errorPrice, setErrorPrice] = useState(null);

  useEffect(() => {
    // ...fetch eventStats như cũ...
    fetch("http://localhost:3001/api/admin/event-action-total-price")
      .then((res) => res.json())
      .then((data) => {
        setTotalPrice(data);
        setLoadingPrice(false);
        console.log(data);
      })
      .catch(() => {
        setErrorPrice("Không thể tải tổng giá trị event");
        setLoadingPrice(false);
      });
  }, []);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/admin/event-action-stats")
      .then((res) => res.json())
      .then((data) => {
        setEventStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu event action");
        setLoading(false);
      });
  }, []);
  const [funnel, setFunnel] = useState(null);
  const [loadingFunnel, setLoadingFunnel] = useState(true);
  const [errorFunnel, setErrorFunnel] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/admin/funnel-analysis")
      .then((res) => res.json())
      .then((data) => {
        setFunnel(data);
        setLoadingFunnel(false);
      })
      .catch(() => {
        setErrorFunnel("Không thể tải dữ liệu funnel analysis");
        setLoadingFunnel(false);
      });
  }, []);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [newUserCount, setNewUserCount] = useState(null);

  const fetchNewUsers = () => {
    console.log(dateRange.start + "   " + dateRange.end)
    fetch(`http://localhost:3001/customer/customer/new-users?start=${dateRange.start}&end=${dateRange.end}`)
      .then(res => res.json())
      .then(data => { console.log(data); setNewUserCount(data.count); });

  };
  const [appActionStats, setAppActionStats] = useState(null);
  const [loadingAppAction, setLoadingAppAction] = useState(true);
  const [errorAppAction, setErrorAppAction] = useState(null);
  const [activeUserCount, setActiveUserCount] = useState(null);
  const [activeUserLoading, setActiveUserLoading] = useState(false);
  const [activeUserError, setActiveUserError] = useState(null);

  // Lấy tổng event app_action
  useEffect(() => {
    fetch("http://localhost:3001/api/admin/app-action-stats")
      .then((res) => res.json())
      .then((data) => {
        setAppActionStats(data);
        setLoadingAppAction(false);
      })
      .catch(() => {
        setErrorAppAction("Không thể tải dữ liệu app action");
        setLoadingAppAction(false);
      });
  }, []);

  // Lấy số user active theo khoảng thời gian
  const fetchActiveUsers = () => {
    if (!dateRange.start || !dateRange.end) return;
    setActiveUserLoading(true);
    setActiveUserError(null);
    setActiveUserCount(null);
    fetch(`http://localhost:3001/api/admin/app-action-active-users?from=${dateRange.start}T00:00:00Z&to=${dateRange.end}T23:59:59Z`)
      .then(res => res.json())
      .then(data => {
        setActiveUserCount(data.activeUsers);
        setActiveUserLoading(false);
      })
      .catch(() => {
        setActiveUserError("Không thể tải số user active");
        setActiveUserLoading(false);
      });
  };
  const [chatInput, setChatInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  function buildPromptFromStats() {
    return `
Dưới đây là thống kê hành vi người dùng từ một website bán hàng:

- product_action: (là hành động của người mua)
  + add_to_cart: ${eventStats?.add_to_cart ?? 0}
  + remove_from_cart: ${eventStats?.remove_from_cart ?? 0}
  + view: ${eventStats?.view ?? 0}
  + purchase: ${eventStats?.purchase ?? 0}

- app_action: (là số event mà người dùng truy cập vào trang web)
  + view_page: ${appActionStats?.view_page ?? 0}

- Tổng số người dùng duy nhất: ${(appActionStats?.realUserCount ?? 0) + (appActionStats?.guestUserCount ?? 0)}
- Tổng số lượt xem trang duy nhất: ${appActionStats?.view_page ?? 0}

- context:
  + product_entity: 0
  + web_page: 0
  + user_context: 0

- Tổng giá trị:
  + add_to_cart: ${totalPrice?.add_to_cart ?? 0}
  + purchase: ${totalPrice?.purchase ?? 0}

Hãy phân tích dữ liệu trên, đưa ra nhận xét, chỉ ra những điểm bất thường nếu có và đưa ra một số lời khuyên giúp tối ưu trải nghiệm người dùng và tăng tỉ lệ mua hàng.
  `;
  }
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisResult("");
    setAnalysisError("");
    try {
        const promptToSend = chatInput.trim() === "" ? buildPromptFromStats() : chatInput;
        console.log(promptToSend);
        const res = await fetch("http://localhost:3001/api/admin/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend })
      });
      const data = await res.json();
      if (data.analysis) setAnalysisResult(data.analysis);
      else setAnalysisError("Không nhận được kết quả từ AI");
    } catch (e) {
      setAnalysisError("Lỗi khi gọi API phân tích");
    }
    setAnalyzing(false);
  };

  return (
    <div className={cx("wrap")}>
      <div style={{ marginTop: 40 }}>
        <h3>Thống kê Event Actions</h3>
        {loading && <div>Đang tải dữ liệu...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {eventStats && (
          <table className={cx("event-table")}>
            <thead>
              <tr>
                <th>Loại Event</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(eventStats).map(([action, count]) => (
                <tr key={action}>
                  <td>{action}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Tổng giá trị Event Actions</h3>
        {loadingPrice && <div>Đang tải dữ liệu...</div>}
        {errorPrice && <div style={{ color: 'red' }}>{errorPrice}</div>}
        {totalPrice && (
          <table className={cx("event-table-price")}>
            <thead>
              <tr>
                <th>Loại Event</th>
                <th>Tổng giá trị (VND)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totalPrice).map(([action, price]) => (
                <tr key={action}>
                  <td>{action}</td>
                  <td>{formatNumber(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}  VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Funnel Analysis</h3>
        {loadingFunnel && <div>Đang tải dữ liệu...</div>}
        {errorFunnel && <div style={{ color: 'red' }}>{errorFunnel}</div>}
        {funnel && (
          <div className={cx("funnel-flex")}>
            <div className={cx("funnel-labels")}>
              <div className={cx("funnel-label")}>View</div>
              <div className={cx("funnel-label")}>Add to Cart</div>
              <div className={cx("funnel-label")}>Purchase</div>
            </div>
            <div className={cx("funnel-bars")}>
              {(() => {
                // Tính tỉ lệ width dựa trên max value
                const steps = [
                  { label: "View", value: funnel.view },
                  { label: "Add to Cart", value: funnel.add_to_cart },
                  { label: "Purchase", value: funnel.purchase }
                ];
                const max = Math.max(...steps.map(s => s.value), 1);
                return steps.map((step, idx) => (
                  <div
                    key={step.label}
                    className={cx("funnel-bar")}
                    style={{
                      width: `${(step.value / max) * 320 + 80}px`, // min width 80, max 400
                      marginBottom: idx < steps.length - 1 ? "-2px" : "0"
                    }}
                  >
                    <span className={cx("funnel-bar-value")}>{step.value}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
      <div className={cx("new-user-stats")}>
        <h3>Thống kê User mới</h3>
        <div className={cx("new-user-date-row")}>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>đến</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <div className={cx("new-user-btn-row")}>
          <button onClick={fetchNewUsers}>Thống kê</button>
        </div>
        {newUserCount !== null && (
          <div className={cx("new-user-count")}>
            Số user mới: <span>{newUserCount ? newUserCount : 0}</span>
          </div>
        )}
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Thống kê App Actions</h3>
        {loadingAppAction && <div>Đang tải dữ liệu...</div>}
        {errorAppAction && <div style={{ color: 'red' }}>{errorAppAction}</div>}
        {appActionStats && (
          <>
            <table className={cx("event-table")}>
              <thead>
                <tr>
                  <th>Loại App Action</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(appActionStats).map(([action, count]) => (
                  <tr key={action}>
                    <td>{action}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div style={{ marginTop: 16 }}>
              <b>Số user thực:</b> {appActionStats.realUserCount ?? 0} <br />
              <b>Số user guest:</b> {appActionStats.guestUserCount ?? 0}
            </div> */}
          </>
        )}
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Thống kê User Active (App Action)</h3>
        <div className={cx("new-user-date-row")}>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>đến</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <div className={cx("new-user-btn-row")}>
          <button onClick={fetchActiveUsers}>Thống kê User Active</button>
        </div>
        {activeUserLoading && <div>Đang tải dữ liệu...</div>}
        {activeUserError && <div style={{ color: 'red' }}>{activeUserError}</div>}
        {activeUserCount !== null && (
          <div className={cx("new-user-count")}>Số user active: <span>{activeUserCount}</span></div>
        )}
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Phân tích AI (Chat với hệ thống)</h3>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 600, margin: '0 auto' }}>
          <textarea
            rows={3}
            style={{ width: '100%', marginBottom: 8 }}
            placeholder="Nhập nội dung hoặc để trống để phân tích tự động..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
          />
          <button onClick={handleAnalyze} disabled={analyzing} style={{ marginBottom: 8 }}>
            {analyzing ? 'Đang phân tích...' : 'Phân tích'}
          </button>
          {analysisResult && (
            <div style={{ whiteSpace: 'pre-line', background: '#f8f8f8', padding: 12, borderRadius: 6, marginTop: 8 }}>
              <b>Kết quả phân tích:</b>
              <div>{analysisResult}</div>
            </div>
          )}
          {analysisError && (
            <div style={{ color: 'red', marginTop: 8 }}>{analysisError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analys;
