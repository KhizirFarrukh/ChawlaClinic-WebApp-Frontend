FROM php:apache

COPY apache-config/pages-site.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY pages/ pages/
COPY styles/ styles/
COPY scripts/ scripts/
COPY bootstrap/ bootstrap/
COPY partials/ partials/
COPY config.json /var/www/html/config.json

EXPOSE 80

CMD ["apache2-foreground"]
