import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { MAX_POINTS } from "../../../../../../hooks/events/useNetworkStat";
import CellTowerOutlinedIcon from "@mui/icons-material/CellTowerOutlined";
import NetworkAdvice from "./NetworkAdvice";

const NetworkDiagnostic = () => {
  return (
    <Box>
      <Toolbar disableGutters>
        <Typography
          variant='h6'
          fontSize={16}
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            mx: 1,
          }}>
          <CellTowerOutlinedIcon />
          <span>État du réseau</span>
        </Typography>
      </Toolbar>
      <ListSubheader
        disableGutters
        disableSticky
        sx={{
          bgcolor: "transparent",
          display: "flex",
          alignItems: "center",
          mb: -0.5,
          px: 1,
        }}>
        <Box component='span' display='inline-flex' alignItems='center'>
          <SpeedOutlinedIcon color='currentColor' />
        </Box>
        <span style={{ marginLeft: 8 }}>Réactivité</span>
      </ListSubheader>
      <Box mx={1}>
        <Typography color='text.secondary' variant='body2'>
          Plus le pic est haut, plus la connexion est lente: au-delà de 300 ms,
          la communication peut être impactée.
        </Typography>
      </Box>

      <TimeChart />
      <NetworkAdvice />
    </Box>
  );
};

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const TimeChart = () => {
  const rttData = useSelector(
    (store) => store.data.app.setting.network.rttData
  );
  const labels = useMemo(
    () =>
      Array(MAX_POINTS - rttData?.length)
        .fill("")
        .concat(rttData.map((d) => d.time)),
    [rttData]
  );
  const dataPoints = useMemo(
    () =>
      Array(MAX_POINTS - rttData?.length)
        .fill(null)
        .concat(rttData.map((d) => d.delay)),
    [rttData]
  );
  const theme = useTheme();

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Response Time (ms)",
          data: dataPoints,
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          clip: true,
        },
        {
          label: "Threshold (300ms)",
          data: Array(MAX_POINTS).fill(300),
          borderColor: theme.palette.text.secondary,
          borderWidth: 0.8,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    }),
    [labels, dataPoints, theme]
  );

  const options = useMemo(
    () => ({
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 0 }, autoPadding: false },
      scales: {
        x: {
          title: { display: false },
          border: { display: true, color: theme.palette.text.secondary },
          ticks: {
            align: "center",
            padding: 0,
            maxRotation: 0,
            minRotation: 0,
            color: theme.palette.text.secondary,
            backdropPadding: 0,
            font: { size: 10 },
            callback: function (_, index) {
              return labels[index] !== "" ? labels[index] : null;
            },
          },
          grid: {
            display: true,
            drawTicks: true,
            color: "transparent",
            tickColor: theme.palette.text.secondary,
          },
        },
        y: {
          position: "right",
          title: { display: false },
          min: 0,
          max: 600,
          grid: {
            drawTicks: false,
            display: true,
            color: theme.palette.divider,
            lineWidth: (context) => (context?.tick?.value === 300 ? 0 : 0.5),
          },
          ticks: {
            color: theme.palette.text.secondary,
            font: { size: 10 },
            callback: (value) => `${typeof value === "number" ? value : ""} ms`,
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
      },
    }),
    [theme, labels]
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: 120,
        position: "relative",
        overflow: "hidden",
        ml: 2,
        "& > canvas": {
          position: "relative",
          right: "30px",
        },
      }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default NetworkDiagnostic;
