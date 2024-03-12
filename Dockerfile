FROM php:apache

COPY apache-config/pages-site.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY files/ files/
COPY index.html /var/www/html/index.html
COPY page-not-found.html /var/www/html/page-not-found.html
COPY patient.html /var/www/html/patient.html
COPY under-construction.html /var/www/html/under-construction.html

EXPOSE 80

CMD ["apache2-foreground"]
