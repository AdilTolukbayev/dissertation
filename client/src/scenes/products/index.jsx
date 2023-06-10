import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";
import Layout from "scenes/layout";

const Product = ({ name, count, rating, description }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        {/* <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography> */}
        <Typography variant="h5" component="div">
          <Typography variant="h5" component="p">
            Vaccine name:
          </Typography>
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          Count: {Number(count).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        {/* 
        <Typography variant="body2">{description}</Typography> */}
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {description._id}</Typography>
          <Typography>Страна производитель: {description.country}</Typography>
          <Typography>
            Описание: {description.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  console.log(data);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Вакцины" subtitle="Список вакцин" />
      {/* <Button
          variant="primary"
          size="small"
          onClick={() => <Layout />}
        >
          See More
        </Button> */}
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(({ vaccine, count, rating, description }) => (
            <Product
              key={vaccine}
              name={vaccine}
              count={count}
              rating={rating}
              description={description}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
